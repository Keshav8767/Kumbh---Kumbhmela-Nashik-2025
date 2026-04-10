const BaseAgent = require('./baseAgent');
const MedicalPost = require('../db/schemas/medicalPost');
const { generateResponse } = require('../llm/gemini');
const { medicalPrompt } = require('../llm/prompts');

class MedicalAgent extends BaseAgent {
  constructor(bus) {
    super(bus);
    this.agentName = "MedicalAgent";
    this.subscribe("agent.medical", this.handleMessage.bind(this));
  }

  async handleMessage(message) {
    this.log("🚑 Processing message:", message.text);
    try {
      // Basic RAG: Fetch operational medical posts
      const posts = await MedicalPost.find({ status: 'operational' }).limit(5);
      const nearestPosts = posts.map(p => `${p.name} (Zone: ${p.zone}, Contact: ${p.contact})`).join(', ');

      const context = { nearestPost: nearestPosts || 'None available currently' };
      const { system, user } = medicalPrompt(message.text, context);

      const reply = await generateResponse(system, user);
      
      this.reply(message.userId, reply);
    } catch (err) {
      this.log("❌ Error:", err.message);
      this.reply(message.userId, "I'm having trouble accessing medical systems. Please find the nearest volunteer immediately.");
    }
  }
}

module.exports = MedicalAgent;