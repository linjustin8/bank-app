export type AccountType = "SAVINGS" | "CHECKING"

export interface Account {
  id: number
  userId: number
  accountType: AccountType
  balance: string
}

export interface CreateAccountRequest {
  userId: number
  accountType: AccountType
}
