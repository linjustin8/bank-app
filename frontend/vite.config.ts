import path from "path"

import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import dotenv from "dotenv"
import { defineConfig } from "vite"

const rootEnvDir = path.resolve(import.meta.dirname, "..")

dotenv.config({ path: path.join(rootEnvDir, ".env") })

export default defineConfig({
  envDir: rootEnvDir,
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
})
