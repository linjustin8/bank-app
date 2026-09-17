import { SignInButton, SignUpButton } from "@clerk/react";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#98BCEE]">
      <div className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1300px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1000px] text-center">
          <h1 className="text-[clamp(3.3rem,6vw,7rem)] font-black leading-[0.9] tracking-[-0.06em] text-white drop-shadow-[0_4px_0_rgba(255,255,255,0.18)]">
            G3 Banking App
          </h1>

          <p className="mt-8 text-[clamp(2rem,2.6vw,3.2rem)] font-medium leading-tight text-[#f4f8ff]">
            Banking made simple.
          </p>

          <p className="mx-auto mt-4 max-w-[760px] text-[clamp(2.2rem,3vw,4rem)] font-medium leading-[1.04] tracking-[-0.045em] text-[#f7faff]">
            Manage your money, track your spending,
            <br className="hidden md:block" />
            and access your accounts securely.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <SignInButton>
              <button
                type="button"
                className="min-w-[250px] rounded-full border border-[#d7d9f5] bg-[#edf3fb]/80 px-8 py-5 text-[1.05rem] font-medium text-[#1a2a45] shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_3px_0_rgba(148,156,187,0.45)] transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#f5f8fe] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_5px_0_rgba(148,156,187,0.55)]"
              >
                View Account
              </button>
            </SignInButton>

            <SignUpButton>
              <button
                type="button"
                className="min-w-[250px] rounded-full bg-[#1d63e7] px-8 py-5 text-[1.05rem] font-semibold text-white shadow-[0_4px_0_rgba(18,74,183,0.9)] transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#1a5ae0] hover:shadow-[0_6px_0_rgba(18,74,183,0.95)]"
              >
                Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  )
}
