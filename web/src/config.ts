export const {
  VITE_OLLAMA_URL: OLLAMA_URL = location.origin,
  VITE_LOG_LEVEL: LOG_LEVEL = "",
  VITE_IN_MEMORY_DB: IN_MEMORY_DB = false,
} = import.meta.env;
export const { DEV, PROD } = import.meta.env;
