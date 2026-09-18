import { useRef, useState, type FormEvent } from "react"
import { isAxiosError } from "axios"
import { Link, useNavigate } from "react-router"

import { Button } from "~/components/ui/button"
import { useAccountData } from "~/hooks/use-account-data"
import { formatCurrency } from "~/lib/account-data"
import { useApi } from "~/hooks/use-api"

export function meta() {
  return [{ title: "Transfer Money · G3 Banking" }]
}

export default function Transfer() {
  const navigate = useNavigate()
  const { post } = useApi()
  const { accounts, message, accountLink } = useAccountData()
  const [fromAccountId, setFromAccountId] = useState("")
  const [toAccountId, setToAccountId] = useState("")
  const [amount, setAmount] = useState("")
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const submitting = useRef(false)

  if (!accounts) return <p role="status">{message}</p>

  const canTransfer =
    fromAccountId !== "" &&
    toAccountId !== "" &&
    fromAccountId !== toAccountId &&
    amount !== ""

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canTransfer || submitting.current || success) return

    submitting.current = true
    setPending(true)
    setError("")
    try {
      await post("/api/accounts/transfer", {
        fromAccountId: Number(fromAccountId),
        toAccountId: Number(toAccountId),
        amount,
      })
      setSuccess(true)
      navigate(`/account_details?accountId=${fromAccountId}`)
    } catch (error) {
      const detail = isAxiosError(error) ? error.response?.data?.detail : null
      setError(
        typeof detail === "string" ? detail : "Unable to confirm the transfer. Check your balances before trying again."
      )
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-2xl font-bold text-black">
          Transfer money
        </span>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-busy={pending}
        className="space-y-5 rounded-2xl border bg-blue-100 p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="fromAccount"
            className="block text-sm font-medium text-foreground"
          >
            From
          </label>
          <select
            id="fromAccount"
            required
            disabled={pending || success}
            value={fromAccountId}
            onChange={(event) => {
              setFromAccountId(event.target.value)
              if (event.target.value === toAccountId) setToAccountId("")
              setError("")
            }}
            className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>
              Select an account
            </option>
            {accounts.map((option) => (
              <option key={option.id} value={option.id}>
                {option.accountType} · #{option.id} ·{" "}
                {formatCurrency(Number(option.balance))}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="toAccount"
            className="block text-sm font-medium text-foreground"
          >
            To
          </label>
          <select
            id="toAccount"
            required
            disabled={pending || success}
            value={toAccountId}
            onChange={(event) => setToAccountId(event.target.value)}
            className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value="" disabled>
              Select an account
            </option>
            {accounts.map((option) => {
              const isSendAccount = String(option.id) === fromAccountId
              return (
                <option
                  key={option.id}
                  value={option.id}
                  disabled={isSendAccount}
                  className="disabled:text-muted-foreground"
                >
                  {option.accountType} · #{option.id} ·{" "}
                  {formatCurrency(Number(option.balance))}
                  {isSendAccount ? " (sending account)" : ""}
                </option>
              )
            })}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-foreground"
          >
            Amount
          </label>
          <div className="mt-1.5 flex items-center rounded-lg border bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <span className="text-sm text-muted-foreground">$</span>
            <input
              id="amount"
              required
              disabled={pending || success}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full [appearance:textfield] bg-transparent py-2.5 pl-2 text-sm tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs font-medium text-green-600">
            Transfer successful! Redirecting to your account details...
          </p>
        )}

        <Button
          type="submit"
          variant="ghost"
          size="lg"
          className="w-full rounded-full border border-border bg-[#1d63e7]/20 py-3 text-lg text-black! shadow-none hover:bg-[#1d63e7]/20 hover:text-[#1d63e7]!"
          disabled={!canTransfer || pending || success}
        >
          {pending ? "Transferring…" : success
              ? "Transfer complete" : "Transfer"}
        </Button>
      </form>

      <Link
        to={accountLink("/account_details")}
        className="block text-center text-xs font-medium text-primary hover:underline"
      >
        Back to account
      </Link>
    </div>
  )
}
