import { AmountForm } from "~/components/account/amount-form"

export function meta() {
  return [{ title: "Deposit · G3 Banking" }]
}

export default function Deposit() {
  return (
    <AmountForm
      title="Deposit"
      description="Add money to your checking account."
      submitLabel="Deposit funds"
    />
  )
}
