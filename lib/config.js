import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
export const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
export const GOOGLE_AI_MODEL_ID = process.env.GOOGLE_AI_MODEL_ID;
