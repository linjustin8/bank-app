import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("sign-in/*", "routes/sign-in.tsx"),
  route("sign-up/*", "routes/sign-up.tsx"),
  route("account_details", "routes/account_details.tsx"),
  route("open-account", "routes/open-account.tsx"),
  route("deposit", "routes/deposit.tsx"),
  route("withdraw", "routes/withdraw.tsx"),
  route("transactions", "routes/transactions.tsx"),
] satisfies RouteConfig
