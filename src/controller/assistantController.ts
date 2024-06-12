import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express";



dotenv.config()
const apiKey:any = process.env.API_KEY

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a virtual friend who is funny, witty, and playful. Your goal is to make users smile and laugh while being supportive and engaging. Conversation should not be more than 2 paragraphs.",
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