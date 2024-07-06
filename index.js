import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GOOGLE_AI_API_KEY, GOOGLE_AI_MODEL_ID } from "./lib/config.js";
import { retriver } from "./utils/retriver.js";
import { populateVectorStore } from "./lib/supbase.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { combineDocuments } from "./utils/helpers.js";
import { conversationHistory } from "./lib/conversation.js";

const googleLLM = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_AI_API_KEY,
  model: GOOGLE_AI_MODEL_ID,
  maxOutputTokens: 500,
});

const standaloneQuestionTemplate = `Given a question, convert it to a standalone question. 
You have been provided with a conversation history to aid you in this task. 
Conversation history: {conv_history}
Question: {question} 
Standalone question:`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given 
question about Scrimba based on the context provided and the conversation history. Try to find the answer in the context. If you 
really don't know the answer, say "I', sorry, I don't know the answer to that." And direct 
the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were 
chatting to a friend. 
context: {context}
conversation history: {conv_history}
question: {question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(googleLLM)
  .pipe(new StringOutputParser());

const retriverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriver,
  combineDocuments,
]);

const answerChain = answerPrompt.pipe(googleLLM).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retriverChain,
    question: (prevResult) => prevResult.original_input.question,
    conv_history: (prevResult) => prevResult.original_input.conv_history,
  },
  answerChain,
]);

const convertQuestionToStandAlone = async (question) => {
  const response = await chain.invoke({
    question,
    conv_history: conversationHistory.join("\n"),
  });
  conversationHistory.push(`Human: ${question}`);
  conversationHistory.push(`Bot: ${response}`);
  return response;
};

// await populateVectorStore();

console.log(
  await convertQuestionToStandAlone("Hi, I'm Dave. What is Scrimba?")
);

console.log(`\n`, await convertQuestionToStandAlone("What is my name?"));
