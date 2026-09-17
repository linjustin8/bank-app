import { Link } from "react-router"
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react-router"

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full flex bg-white text-black">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[74px] w-3/5 flex-wrap items-center justify-between gap-4 py-4 pr-6 pl-6 sm:pl-[46px]"
      >
        <Link
          to="/"
          className="text-[28px] leading-tight font-semibold sm:text-[36px]"
        >
          G3 Banking
        </Link>

        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm sm:gap-7">
          <a href="#about" className="text-[#333] hover:underline">
            About
          </a>

          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="rounded-[7px] px-5 py-2 text-xs font-semibold hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button
                type="button"
                className="rounded-[7px] bg-[#222] px-5 py-2 text-xs font-semibold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  )
}
