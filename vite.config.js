import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Using relative asset URLs ("./") so the build works at any GitHub Pages
// subpath (e.g. /your-repo/) without hard-coding the repo name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
