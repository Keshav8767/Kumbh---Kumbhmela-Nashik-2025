const BaseAgent = require('./baseAgent');
const Zone = require('../db/schemas/zone');
const { generateResponse } = require('../llm/gemini');
const { navigationPrompt } = require('../llm/prompts');

class NavigationAgent extends BaseAgent {
  constructor(bus) {
    super(bus);
    this.agentName = "NavigationAgent";
    this.subscribe("agent.navigation", this.handleMessage.bind(this));
  }

  async handleMessage(message) {
    this.log("🧭 Processing message:", message.text);
    try {
      const zones = await Zone.find().limit(5);
      const zoneDetails = zones.map(z => `${z.name} (Landmarks: ${z.landmarks.join(', ')})`).join(' | ');

      const context = { zones: [zoneDetails] };
      const { system, user } = navigationPrompt(message.text, context);

      const reply = await generateResponse(system, user);
      
      this.reply(message.userId, reply);
    } catch (err) {
      this.log("❌ Error:", err.message);
      this.reply(message.userId, "I'm experiencing navigation system issues. Please follow the signs to the nearest gate.");
    }
  }
}

module.exports = NavigationAgent;