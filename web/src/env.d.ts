interface ImportMetaEnv {
  readonly VITE_OLLAMA_URL: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
