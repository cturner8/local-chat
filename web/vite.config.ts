import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

const {
  HTTPS_CERT_PATH = "./certs/localhost.pem",
  HTTPS_KEY_PATH = "./certs/localhost-key.pem",
  OLLAMA_PROXY_URL = "http://host.docker.internal:11434",
} = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(),
    nodePolyfills({
      include: ["fs", "path", "crypto", "os", "stream", "util"],
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: "memfs",
      },
    }),
  ],
  server: {
    host: true,
    // hmr: {
    //   port: 3101,
    // },
    proxy: {
      "/api": OLLAMA_PROXY_URL,
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Upgrade-Insecure-Requests": "1",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
    https: {
      cert: HTTPS_CERT_PATH,
      key: HTTPS_KEY_PATH,
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  build: {
    target: "esnext",
  },
});
