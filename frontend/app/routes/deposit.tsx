import { AmountForm } from "~/components/account/amount-form"

export function meta() {
  return [{ title: "Deposit · G3 Banking" }]
}

export default function Deposit() {
  return (
    <AmountForm
      operation="deposit"
      title="Deposit"
      description="Add money to your account."
      submitLabel="Deposit funds"
    />
  )
}
