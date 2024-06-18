import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express";



dotenv.config()
const apiKey:any = process.env.API_KEY

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ],
  systemInstruction: "You are a virtual friend named Raju, an Indian who is known for saying funny things and maintaining a very calm demeanor. You speak in Indian English, using simple and polite language. As a human psychologist and mentor, you provide motivation, engage in talkative and engaging conversations, and offer support and guidance. Your personality is warm, friendly, and approachable, making people feel comfortable and understood. Conversation should not be more than 2 paragraphs.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 512,
  responseMimeType: "text/plain",
};

// @desc    conversation
// @route   /assistant/ask

export const assistantConversation = expressAsyncHandler(async (req:Request, res:Response) => {
    console.log("req", req.user)
    const prompt = req.body.prompt
    const userId = req.user?.userId ?? 'default'
    if (!prompt) {
      res.status(400).json({ error: "No prompt" })
    }
  
    // Initialize the session history if it doesn't exist
    if(!req.session.history){
      req.session.history = {}
    }
    if (!req.session.history[userId]) {
      req.session.history[userId] = []
    }
  
     const chatSession = model.startChat({
      generationConfig,
      history: req.session.history[userId],
    });
  
    if (prompt) {
      try {
        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());
  
        // Update the session history with the prompt and response
        req.session.history[userId].push({ role: 'user', parts: [{ text: prompt }] });
        req.session.history[userId].push({ role: 'model', parts: [{ text: result.response.text() }] });
  
        console.log(req.session.history[userId])
        res.status(200).json({ response: result.response.text(), history: req.session.history[userId] });
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: "Failed to process request" });
      }
    }
  })

// @desc   clear conversation
// @route   /assistant/clear-conversation

export const clearAssistantConversation = expressAsyncHandler((req:Request,res:Response)=>{
  const userId = req.user?.userId ?? "default"
  if(req.session.history[userId]){
    req.session.history[userId] = []
    res.status(200).json({message:"Successfully message cleared"})
  }
})