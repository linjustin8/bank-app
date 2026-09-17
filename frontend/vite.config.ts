import path from "path"

import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  envDir: path.resolve(__dirname, ".."),
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
})
