const BaseAgent = require('./baseAgent');
const FoundCase = require('../db/schemas/foundCase');
const { generateResponse } = require('../llm/gemini');
const { lostPersonPrompt } = require('../llm/prompts');

class LostPersonAgent extends BaseAgent {
  constructor(bus) {
    super(bus);
    this.agentName = "LostPersonAgent";
    this.subscribe("agent.lost", this.handleMessage.bind(this));
  }

  async handleMessage(message) {
    this.log("👤 Processing message:", message.text);
    try {
      // Pass some unmatched found cases to the LLM to see if there's a match
      const cases = await FoundCase.find({ status: 'unmatched' }).limit(5);
      
      const matchingCases = cases.map(c => ({
        id: c.caseId,
        age: c.foundPerson.approximateAge,
        gender: c.foundPerson.gender,
        clothing: c.foundPerson.clothing.colors.join(' '),
        location: c.foundPerson.currentLocation
      }));

      const context = { matchingCases };
      const { system, user } = lostPersonPrompt(message.text, context);

      const reply = await generateResponse(system, user);
      
      this.reply(message.userId, reply);
    } catch (err) {
      this.log("❌ Error:", err.message);
      this.reply(message.userId, "I'm having trouble searching the database. Please go to the nearest Lost and Found tent immediately.");
    }
  }
}

module.exports = LostPersonAgent;