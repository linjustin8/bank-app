import { AmountForm } from "~/components/account/amount-form"

export function meta() {
  return [{ title: "Withdraw · G3 Banking" }]
}

export default function Withdraw() {
  return (
    <AmountForm
      operation="withdraw"
      title="Withdraw"
      description="Move money out of your account."
      submitLabel="Withdraw funds"
    />
  )
}
