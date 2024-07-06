import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import {
  GOOGLE_AI_API_KEY,
  SUPABASE_API_KEY,
  SUPABASE_PROJECT_URL,
} from "./config.js";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GOOGLE_AI_API_KEY,
});

const populateVectorStore = async () => {
  try {
    const result = fs.readFileSync("knowledge/scrimba-info.txt", "utf8");
    const text = result.toString();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const output = await splitter.createDocuments([text]);

    const client = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);

    await SupabaseVectorStore.fromDocuments(output, embeddings, {
      client,
      tableName: "documents",
    });
  } catch (err) {
    console.log(err);
  }
};

export { embeddings, populateVectorStore };
