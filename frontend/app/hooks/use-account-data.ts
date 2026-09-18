import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useApi } from "~/hooks/use-api"
import {
  type Account,
  type Transaction,
  monthlyFlows,
} from "~/lib/account-data"

type ApiAccount = Omit<Account, "balance" | "userName"> & {
  balance: string | number
}
type ApiTransaction = Omit<Transaction, "amount" | "category"> & {
  amount: string | number
}
type AccountData = {
  account: Account
  accounts: ApiAccount[]
  transactions: Transaction[]
}

export function useAccountData() {
  const api = useApi()
  const [params, setParams] = useSearchParams()
  const selectedId = params.get("accountId")
  const [state, setState] = useState<{
    data: AccountData | null
    message: string
    key?: string
  }>({ data: null, message: "Loading account…" })
  const key = `${api.isSignedIn}:${selectedId}`

  useEffect(() => {
    if (!api.isLoaded || !api.isSignedIn) return
    const controller = new AbortController()
    const config = { signal: controller.signal }
    setState({ data: null, message: "Loading account…", key })
    async function load() {
      try {
        const [user, accounts] = await Promise.all([
          api.get<{ name: string }>("/api/users/me", config),
          api.get<ApiAccount[]>("/api/accounts", config),
        ])
        if (controller.signal.aborted) return
        const selected =
          selectedId === null
            ? accounts[0]
            : accounts.find((account) => String(account.id) === selectedId)
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
        const [account, history] = await Promise.all([
          api.get<ApiAccount>(`/api/accounts/${selected.id}`, config),
          api.get<ApiTransaction[]>(
            `/api/accounts/${selected.id}/transactions`,
            config
          ),
        ])
        const transactions = history
          .map((txn) => ({
            ...txn,
            amount: Number(txn.amount),
            category: txn.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
          }))
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        if (!controller.signal.aborted)
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
    return () => controller.abort()
  }, [api, selectedId, key])

  const data =
    api.isLoaded && api.isSignedIn && state.key === key ? state.data : null
  return {
    ...data,
    monthlyFlow: data
      ? monthlyFlows(data.account.balance, data.transactions)
      : [],
    message: !api.isLoaded
      ? "Loading session…"
      : !api.isSignedIn
        ? "Please sign in to view your account."
        : state.key !== key
          ? "Loading account…"
          : state.message,
    accountLink: (path: string) =>
      `${path}?accountId=${data?.account.id ?? selectedId ?? ""}`,
    selectAccount: (id: string) =>
      setParams((current) => {
        current.set("accountId", id)
        return current
      }),
  }
}
