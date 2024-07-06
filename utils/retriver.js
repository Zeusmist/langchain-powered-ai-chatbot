import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  OPENAI_API_KEY,
  SUPABASE_API_KEY,
  SUPABASE_PROJECT_URL,
} from "../lib/config.js";
import { createClient } from "@supabase/supabase-js";
import { embeddings } from "../lib/supbase.js";

const client = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriver = vectorStore.asRetriever();

export { retriver };
