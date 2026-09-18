import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { isAxiosError } from "axios"
import { useRef, useState, type FormEvent } from "react"
import { Button } from "~/components/ui/button"
import { useAccountData } from "~/hooks/use-account-data"
import { useApi } from "~/hooks/use-api"
import { formatCurrency } from "~/lib/account-data"
import type { Account } from "~/types/account"

interface AmountFormProps {
  title: string
  description: string
  submitLabel: string
  operation: "deposit" | "withdraw"
}

// Creates cards for the Withdraw and deposit pages
export function AmountForm(props: AmountFormProps) {
  const { account, message, accountLink } = useAccountData()
  if (!account) return <p role="status">{message}</p>
  return (
    <LoadedAmountForm
      key={`${account.id}:${props.operation}`}
      {...props}
      accountId={account.id}
      initialBalance={account.balance}
      backLink={accountLink("/account_details")}
    />
  )
}

// Details that appear on the card and page
function LoadedAmountForm({
  title,
  description,
  submitLabel,
  operation,
  accountId,
  initialBalance,
  backLink,
}: AmountFormProps & {
  accountId: number
  initialBalance: number
  backLink: string
}) {
  const api = useApi()
  const [balance, setBalance] = useState(initialBalance)
  const [amount, setAmount] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const submitting = useRef(false)

  // Handles change submissions
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    setError("")
    setSuccess("")
    submitting.current = true
    setPending(true)
    try {
      const updated = await api.post<Account>(
        `/api/accounts/${accountId}/${operation}`,
        { amount }
      )
      setBalance(Number(updated.balance))
      setAmount("")
      setSuccess(
        operation === "deposit" ? "Deposit completed." : "Withdrawal completed."
      )
    } catch (error) {
      const detail = isAxiosError(error) ? error.response?.data?.detail : null
      setError(
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? "Enter a valid amount with up to two decimal places."
            : "Unable to confirm the transaction. Check your balance before trying again."
      )
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <Link
          to={backLink}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to account
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-secondary-foreground">{description}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        aria-busy={pending}
        className="rounded-2xl border bg-card p-6 shadow-sm"
      >
        <p className="mb-3 text-sm text-muted-foreground">
          Account #{accountId}
        </p>
        <dl className="mb-5 flex items-baseline justify-between border-b pb-4">
          <dt className="text-xs text-muted-foreground">Available balance</dt>
          <dd className="text-lg font-semibold text-foreground">
            {formatCurrency(balance)}
          </dd>
        </dl>

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
            name="amount"
            type="number"
            required
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value)
              setError("")
              setSuccess("")
            }}
            disabled={pending}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-transparent py-2.5 pl-2 text-sm tabular-nums outline-none [appearance:textfield]
             [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-5 w-full"
          disabled={pending || !amount}
        >
          {pending ? "Processing…" : submitLabel}
        </Button>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="mt-2 text-sm">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}
