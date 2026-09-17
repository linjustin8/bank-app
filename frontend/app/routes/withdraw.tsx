import { AmountForm } from "~/components/account/amount-form"

export function meta() {
  return [{ title: "Withdraw · G3 Banking" }]
}

export default function Withdraw() {
  return (
    <AmountForm
      title="Withdraw"
      description="Move money out of your checking account."
      submitLabel="Withdraw funds"
    />
  )
}
