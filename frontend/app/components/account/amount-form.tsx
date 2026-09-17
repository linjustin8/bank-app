import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { DUMMY_ACCOUNT, formatCurrency } from "~/lib/account-data"

interface AmountFormProps {
  title: string
  description: string
  submitLabel: string
}

/* Creates boxes for the Withdraw and deposit pages*/
export function AmountForm({
  title,
  description,
  submitLabel,
}: AmountFormProps) {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <Link
          to="/account"
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to account
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-secondary-foreground">{description}</p>
      </header>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <dl className="mb-5 flex items-baseline justify-between border-b pb-4">
          <dt className="text-xs text-muted-foreground">Available balance</dt>
          <dd className="text-lg font-semibold text-foreground">
            {formatCurrency("XXX - Available Banalce here")}
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
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full bg-transparent py-2.5 pl-2 text-sm outline-none tabular-nums"
          />
        </div>

        <Button size="lg" className="mt-5 w-full" disabled>
          {submitLabel}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Not wired to the backend yet.
        </p>
      </div>
    </div>
  )
}
