import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/youtube": {
        target: "https://www.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youtube/, ""),
      },
    },
  },
});
