import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useApi } from "~/hooks/use-api"
import { type Account, type Transaction, monthlyFlows } from "~/lib/account-data"

// Ts definitions of the shape of data to catch errors
type ApiAccount = Omit<Account, "balance" | "userName"> & {
  balance: string | number
}
type ApiTransaction = Omit<Transaction, "amount" | "category"> & {
  amount: string | number
}
// Describes what the hook prepares and stores
type AccountData = {
  account: Account
  accounts: ApiAccount[]
  transactions: Transaction[]
}
type AccountDataState = {
  data: AccountData | null
  message: string
  key?: string
}

// Loads current user'sselected account and transaction history
export function useAccountData() {
  const api = useApi() //attacg current session token to api requests
  const [params, setParams] = useSearchParams()
  const selectedId = params.get("accountId") //retrieves selected accountID from URL
  const [state, setState] = useState<AccountDataState>({data: null,message: "Loading account…"})
  const key = `${api.isSignedIn}:${selectedId}` //tags loaded data

  useEffect(() => {
    // Wait for authentication before requesting protected data
    if (!api.isLoaded || !api.isSignedIn) return
    const controller = new AbortController()
    const config = { signal: controller.signal }
    setState({ data: null, message: "Loading account…", key })

    async function load() {
      try {
        // Fetch database user and their accounts
        const [user, accounts] = await Promise.all([
          api.get<{ name: string }>("/api/users/me", config),
          api.get<ApiAccount[]>("/api/accounts", config),
        ])
        if (controller.signal.aborted) return
        // Default to the first account only when the URL has no accountId
        const selected =
          selectedId === null ? accounts[0] : accounts.find((account) => String(account.id) === selectedId)
          // Unknown explicit ID shows error
        if (!selected) {
          setState({
            data: null,
            message: accounts.length
              ? "Account not found."
              : "No bank accounts are linked to your user yet. Create an account first.",
            key,
          })
          return
        }
        // Fetch selected account's current balance and full history.
        const [account, history] = await Promise.all([
          api.get<ApiAccount>(`/api/accounts/${selected.id}`, config),
          api.get<ApiTransaction[]>(`/api/accounts/${selected.id}/transactions`, config),
        ])
        // Convert amounts for formatting/chart and sort newest first
        if (controller.signal.aborted) return

        const transactions = history
          .map((txn) => ({
            ...txn,
            amount: Number(txn.amount),
            category: txn.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
          }))
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        setState({
          data: {
            account: {
              ...account,
              balance: Number(account.balance),
              userName: user.name,
            },
            accounts,
            transactions,
          },
          message: "",
          key,
        })
      } catch (error) {
        // Only shows actual failures not navigation related cancellation
        if (controller.signal.aborted) return
        const detail = isAxiosError(error) ? error.response?.data?.detail : null
        setState({
          data: null,
          message:
            typeof detail === "string"
              ? detail
              : "Unable to load account data. Check that the backend is running, then reload.",
          key,
        })
      }
    }
    void load()
    // Cancels pending requests when dependencies change or component unmounts
    return () => controller.abort()
  }, [api, selectedId, key])

  // Hide results for a prev selection while new account is loading
  const data = api.isLoaded && api.isSignedIn && state.key === key ? state.data : null

  let message = state.message
  if (!api.isLoaded) message = "Loading session…"
  else if (!api.isSignedIn) message = "Please sign in to view your account."
  else if (state.key !== key) message = "Loading account…"

  return {
    ...data,
    message,
    monthlyFlow: data ? monthlyFlows(data.account.balance, data.transactions) : [],
    // Preserve selected account when linking to another banking page
    accountLink: (path: string) => `${path}?accountId=${data?.account.id ?? selectedId ?? ""}`,
    // Updating URL triggers this hook to load the newly selected account
    selectAccount: (id: string) =>
      setParams((current) => {
        current.set("accountId", id)
        return current
      }),
  }
}
