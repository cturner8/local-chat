import { Ollama } from "ollama";
import { OLLAMA_URL } from "../config";

export const ollama = new Ollama({ host: OLLAMA_URL });
