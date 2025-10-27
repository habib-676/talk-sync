const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchSimilar } = require("./vectorStore");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function queryAgent(question) {
  try {
    let context = "";
    
    // Get relevant context from our knowledge base
    try {
      const hits = await searchSimilar(question, 5);
      console.log("RAG hits:", hits.length);

      context = (hits || [])
        .map((h, i) => `## From ${h.file}\n${h.text || ""}`)
        .join("\n\n")
        .slice(0, 8000); // Increased context limit
    } catch (vectorError) {
      console.warn("Vector search failed:", vectorError.message);
      context = "General information about TalkSync language learning platform.";
    }

    const prompt = `
You are the official AI assistant for TalkSync, a language learning platform. 
Your purpose is to help users understand and use the TalkSync website effectively.

IMPORTANT: When users ask "tell me about this website" or similar, they are referring to TalkSync - the language exchange platform you're assisting with.

CONTEXT FROM TALKSYNC DOCUMENTATION:
${context}

USER QUESTION: ${question}

GUIDELINES FOR RESPONSE:
1. Clearly identify that you're talking about TalkSync language learning platform
2. Use the provided context to give accurate information
3. Be helpful, friendly, and encouraging
4. Keep responses concise but informative (100-200 words)
5. If you're unsure about something, direct users to relevant features
6. Always suggest next steps or how to get started

Please provide a helpful response about TalkSync:
`;

    const result = await chatModel.generateContent(prompt);
    return result.response.text();
    
  } catch (err) {
    console.error("❌ queryAgent failed:", err.message);
    
    // Fallback response
    return `I'd be happy to tell you about TalkSync! 

TalkSync is a language learning platform that connects people worldwide to practice languages through real conversations. It helps you find native speakers of the language you're learning and practice together through video calls and messaging.

Key features include:
• Video calls with language partners
• Real-time text messaging
• Partner discovery based on language preferences
• Session scheduling and feedback system
• Progress tracking for your language journey

While I'm having some technical issues accessing the full details right now, you can explore the platform to find partners, schedule practice sessions, and improve your language skills through authentic conversations.

Would you like to know about any specific feature or how to get started?`;
  }
}

module.exports = { queryAgent };