import { Button } from "~/components/ui/button"
import NavBar from "~/components/navBar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex-1 bg-[#98BCEE]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold">
            Banking made simple.
          </h1>

          <section id="services" className="mt-12">
            <h2 className="text-2xl font-semibold">Our services</h2>
          </section>
        </div>
      </main>
    </div>
  )
}
