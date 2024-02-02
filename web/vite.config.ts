import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Upgrade-Insecure-Requests": "1",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
    https: {
      cert: "./certs/localhost.pem",
      key: "./certs/localhost-key.pem",
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  build: {
    target: "esnext",
  },
});
