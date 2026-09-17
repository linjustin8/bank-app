import { Link } from "react-router"
import { Show, SignInButton, UserButton } from "@clerk/react-router"

export default function NavBar() {
  return (
    <header className="bg-white text-[#1f1f1f]">
      <nav
        aria-label="Main navigation"
        className="flex min-h-[74px] flex-wrap items-center justify-between gap-4 py-4 pr-6 pl-6 sm:pl-[46px]"
      >
        <Link
          to="/"
          className="text-[28px] leading-tight font-semibold sm:text-[36px]"
        >
          G3 Banking
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm font-medium sm:gap-7">
          <a href="#about" className="text-[#2a2a2a] hover:underline">
            About
          </a>

          <a href="#account" className="text-[#2a2a2a] hover:underline">
            Account
          </a>

          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="rounded-[10px] bg-[#1b1b1b] px-5 py-2 text-xs font-semibold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Sign In
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  )
}
