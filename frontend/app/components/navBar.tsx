import { Link } from "react-router"

export default function NavBar() {
  return (
    <header className="bg-white text-black">
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

        <div className="flex items-center gap-7 text-sm">
          <a href="#about" className="text-[#333] hover:underline">
            About
          </a>

          <button
            type="button"
            className="rounded-[7px] bg-[#222] px-5 py-2 text-xs font-semibold text-white hover:bg-black"
          >
            {/* Need to add button for click handler here later */}
            Sign In 
          </button>
        </div>
      </nav>
    </header>
  )
}