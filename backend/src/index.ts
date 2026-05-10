import "dotenv/config";
import express from "express";
import cors from "cors";
import { tavily } from "@tavily/core";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompts.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { authMiddleware } from "./middleware.js";
import { prisma } from "./db.js";
const app = express();
app.use(
  cors({
    origin: process.env.BETTER_AUTH_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// auth handled by better-auth
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());


const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// google gen aI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
app.post("/conversation", authMiddleware, async (req, res) => {
  // get the user query from the body
  const parsedData = querySchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "user query is not valid, send valid query",
    });
  }

  const { query } = parsedData.data;
  // save query in the database

  const userId = req.userId;

  if(!userId) return 
  // web search through tavily
  // const webSearchResponse = await tavilyClient.search(query, {
  //   searchDepth: "advanced",
  // });

  // const webSearchResult = webSearchResponse.results;

  // console.log(webSearchResult)
  // generate response from the llM
  // const prompt = PROMPT_TEMPLATE.replace(
  //   "{{WEB_SEARCH_RESULTS}}",
  //   JSON.stringify(webSearchResult),
  // ).replace("{{USER_QUERY}}", query);
  // const result = await ai.models.generateContent({
  //   model: "gemini-2.5-flash-lite",
  //   // model: "auto",
  //   contents: prompt,
  //   config: {
  //     systemInstruction: SYSTEM_PROMPT,
  //   },
  // });

  const result = await ai.models.generateContentStream({
    model: "gemini-2.5-flash-lite",
    contents: query,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  let fullResponse = "";
  for await (const chunk of result) {
    if (chunk.text) {
      fullResponse += chunk.text;
    }
  }

  const delimiter = "|||END_ANSWER|||";
  const delimiterIndex = fullResponse.indexOf(delimiter);

  let answerText = "";
  let followUps: string[] = [];

  if (delimiterIndex !== -1) {
    answerText = fullResponse.slice(0, delimiterIndex).trim();
    const jsonPart = fullResponse
      .slice(delimiterIndex + delimiter.length)
      .trim();
    try {
      const parsed = JSON.parse(jsonPart);
      followUps = parsed.followUps || [];
    } catch {
      followUps = [];
    }
  } else {
    answerText = fullResponse;
    followUps = [];
  }

  try {
    await prisma.chats.create({
      data: {
        userId: userId,
        query,
        responses: answerText
      },
    });
  } catch (error) {
    throw new Error("Something went wrong while creating chat on chat model")
  }
  res.header("Cache-Control", "no-cache");
  res.header("Content-Type", "text/event-stream");

  const chunkSize = 5;
  for (let i = 0; i < answerText.length; i += chunkSize) {
    res.write(answerText.slice(i, i + chunkSize));
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  res.write(`|||FOLLOWUPS|||${JSON.stringify(followUps)}`);
  res.end();
});

// follow up endpoint for follow up questions
app.post("/conversations-followup", async (req, res) => {
  // Step 1  - get the existing chat from the db
  // Step 2 = forward the full history to the LLM
  // Step 2.5  TODO - Do context engineering here.
  // Step  3 -  stream the response from the server
});

app.get("/stream-test", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  const data =
    "hllo whhat are thee things that are thinsfsd flkjsdkfsdkfj".split(" ");
  let i = 0;

  const interval = setInterval(() => {
    if (i < data.length) {
      res.write(data[i] + " ");
      i++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 50);
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening at port ", process.env.PORT);
});
