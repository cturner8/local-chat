interface ImportMetaEnv {
  readonly VITE_OLLAMA_URL: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_IN_MEMORY_DB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
