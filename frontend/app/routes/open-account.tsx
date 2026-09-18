import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { Button } from "~/components/ui/button"
import { useApi } from "~/hooks/use-api"
import { useCurrentUser } from "~/hooks/use-current-user"
import type {
  Account,
  AccountType,
  CreateAccountRequest,
} from "~/types/account"

export function meta() {
  return [{ title: "Open Bank Account · G3 Banking" }]
}

const ACCOUNT_TYPES: {
  value: AccountType
  label: string
  description: string
}[] = [
  {
    value: "CHECKING",
    label: "Checking",
    description: "",
  },
  {
    value: "SAVINGS",
    label: "Savings",
    description: ""
  },
]

export default function OpenAccount() {
  const navigate = useNavigate()
  const { post } = useApi()
  const { user, error: userError } = useCurrentUser()
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!accountType || !user) return

    setSubmitting(true)
    setError(null)

    try {
      await post<Account, CreateAccountRequest>("/api/accounts", {
        userId: user.user_id,
        accountType,
      })
      setSuccess(true)
      setTimeout(() => navigate("/account_details"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-2xl font-bold text-black">
          Open an account
        </span>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-blue-100 p-6 shadow-sm"
      >
        <p className="mb-4 text-center text-xl font-bold text-foreground">
          Choose your account type
        </p>

        <div role="radiogroup" aria-label="Account type" className="space-y-3">
          {ACCOUNT_TYPES.map((option) => {
            const isSelected = accountType === option.value

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  setAccountType(isSelected ? null : option.value)
                }
                className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border px-4 py-3 text-center transition-colors hover:border-[#1d63e7] hover:bg-[#1d63e7] ${
                  isSelected
                    ? "border-[#1d63e7] bg-[#1d63e7]"
                    : "border-border bg-background"
                }`}
              >
                <span
                  className={`block text-base font-bold group-hover:text-white ${
                    isSelected ? "text-white" : "text-foreground"
                  }`}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    className={`block text-xs group-hover:text-white/80 ${
                      isSelected ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {option.description}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {(error || userError) && (
          <p className="mt-4 text-xs font-medium text-destructive">
            {error ?? userError}
          </p>
        )}

        {success && (
          <p className="mt-4 text-xs font-medium text-green-600">
            Account created successfully! Redirecting to your account
            details...
          </p>
        )}

        <Button
          type="submit"
          variant="ghost"
          size="lg"
          className="mt-5 w-full rounded-full border border-border bg-[#1d63e7]/20 py-3 text-lg text-black! shadow-none hover:bg-[#1d63e7]/20 hover:text-[#1d63e7]!"
          disabled={!accountType || !user || submitting || success}
        >
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  )
}
