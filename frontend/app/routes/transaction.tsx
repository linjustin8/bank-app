export default function Transaction() {
  // DATA MAPPING NOTES FOR BACKEND INTEGRATION:
  // 1) Current logged-in user comes from /api/users/me via useCurrentUser()
  // 2) That user object gives us the local DB user_id.
  // 3) We then need to fetch the user's account(s), likely via /api/users/{user_id}/accounts
  //    or a future /api/accounts?userId={user_id} endpoint.
  // 4) The selected account determines:
  //    - accountType -> "Account Type"
  //    - balance -> "Available Balance"
  //    - id -> accountId used to fetch transactions
  // 5) Transaction history comes from GET /api/accounts/{id}/transactions
  //    where each item contains:
  //      - id
  //      - accountId
  //      - type (DEPOSIT or WITHDRAWAL)
  //      - amount
  //      - createdAt
  // 6) The UI should map:
  //      - Account Type: account.accountType
  //      - Available Balance: account.balance
  //      - Date: transaction.createdAt
  //      - Transaction Details: a label like "Deposit" or "Withdrawal"
  //      - +/- $X: transaction.amount with sign handling

  // Example shape to help future wiring.
  // Replace this mock data with fetched API data once the account + transaction hooks are added.
  const mockTransactions = [
    { date: "09/01/2026", description: "Payroll Deposit", amount: 1250.0 },
    { date: "09/03/2026", description: "Groceries", amount: -84.25 },
    { date: "09/05/2026", description: "Gas Station", amount: -42.0 },
    { date: "09/08/2026", description: "Freelance Payment", amount: 300.0 },
  ]

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#9abfe8] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-[980px] rounded-[18px] border-[3px] border-[#dfeaf8] bg-[#e7eef7]/90 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] sm:p-7">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 text-[1.05rem] text-[#2c2c2c]">
              <span className="font-medium">Account Type:</span>
              <span className="text-[#1d1d1d]">Checking</span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-3 text-[1.05rem] text-[#2c2c2c]">
              <span className="font-medium">Account Name:</span>
              <span className="text-[#1d1d1d]">Optional</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[1.05rem] text-[#2c2c2c]">
            <span className="font-medium">Available Balance:</span>
            <span className="text-[#1d1d1d]">$ 8,500.00</span>
          </div>
        </div>

        <div className="mt-6 rounded-[14px] border-[2px] border-[#c9d6e8] bg-[#edf3f9]/30 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] sm:p-6">
          <div className="max-h-[360px] overflow-y-auto pr-1">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-[14px] border-[2px] border-[#2f2f2f] bg-[#eef4fb] px-4 py-3 text-[#2d2d2d] shadow-[0_1px_0_rgba(0,0,0,0.15)]">
                <span className="w-16 text-base font-medium">Date</span>
                <span className="flex-1 text-base">Transaction Details</span>
                <span className="min-w-[72px] text-right text-base font-medium">+/- $X</span>
              </div>

              {mockTransactions.map((transaction) => (
                <div
                  key={`${transaction.date}-${transaction.description}`}
                  className="flex items-center gap-4 rounded-[14px] border-[2px] border-[#2f2f2f] bg-[#eef4fb] px-4 py-3 text-[#2d2d2d] shadow-[0_1px_0_rgba(0,0,0,0.15)]"
                >
                  <span className="w-16 text-base">{transaction.date}</span>
                  <span className="flex-1 text-base">{transaction.description}</span>
                  <span
                    className={`min-w-[72px] text-right text-base font-medium ${
                      transaction.amount >= 0 ? "text-green-700" : "text-[#2d2d2d]"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : "-"}${" "}
                    {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
