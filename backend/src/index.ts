import express from "express";
import cors from "cors";
import "dotenv/config";
import { tavily } from "@tavily/core";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompts";
const app = express();
app.use(cors());
app.use(express.json());

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// google gen aI
const ai = new GoogleGenAI({});

app.get("/health", (_, res) => {
  return res.status(200).json({
    message: "Ok. Healthy",
  });
});

// Coversation endpoint
// query schema
const querySchema = z.object({
  query: z.string(),
});
app.post("/conversation", async (req, res) => {
  // get the user query from the body
  const parsedData = querySchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "user query is not valid, send valid query",
    });
  }

  const { query } = parsedData.data;

  // web search through tavily
  const webSearchResponse = await tavilyClient.search(query, {
    searchDepth: "advanced",
  });

  const werbSearchResults = webSearchResponse.results;

  // generate response from the llM
  const prompt = PROMPT_TEMPLATE.replace(
    "{{WEB_SEARCH_RESULTS}}",
    JSON.stringify(werbSearchResults),
  ).replace("{{USER_QUERY}}", query);
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });
  console.log(result.text);
  // res.header("Cache-Control", "no-cache");
  // res.header("Content-Type", "text/event-stream");
  // for await (const chunk of result) {
  //   const chunkText = chunk.text
  //   console.log(chunkText)
  //   if(chunkText) {
  //     res.write(chunk);
  //   }
  // }

  // res.write("\n-----------------Sources------------\n");

  // close the event stream
  // res.end();
  return res.status(200).json({
    message: "done",
    result: result.text,
  });
});

// follow up endpoint for follow up questions
app.post("/conversations-followup", async (req, res) => {
  // Step 1  - get the existing chat from the db
  // Step 2 = forward the full history to the LLM
  // Step 2.5  TODO - Do context engineering here.
  // Step  3 -  stream the response from the server
});
app.listen(process.env.PORT, () => {
  console.log("Server is listening at port ", process.env.PORT);
});
