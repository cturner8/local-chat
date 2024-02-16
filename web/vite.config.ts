import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { HTTPS_CERT_PATH, HTTPS_KEY_PATH, OLLAMA_PROXY_URL } = loadEnv(
    mode,
    process.cwd(),
    "",
  );

  return {
    plugins: [
      vue(),
      tsconfigPaths(),
      nodePolyfills({
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          fs: "memfs",
        },
      }),
    ],
    server: {
      host: true,
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
  };
});
