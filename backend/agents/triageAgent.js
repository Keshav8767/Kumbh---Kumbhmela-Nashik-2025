// backend/agents/triageAgent.js

const BaseAgent = require('./baseAgent');

class TriageAgent extends BaseAgent {
  constructor(bus) {
    super(bus);
    this.agentName = "TriageAgent";

    // 🔗 Subscribe to incoming messages
    this.subscribe("message.received", this.handleMessage.bind(this));
  }

  /**
   * Classify the message intent using weighted keyword/phrase matching.
   * Returns: 'medical' | 'lost' | 'navigation' | null
   */
  classifyIntent(text) {
    // High-confidence phrases checked first (order = priority)
    const rules = [
      {
        intent: 'medical',
        // Strong medical signals — "help" alone is NOT enough
        phrases: ['ambulance', 'emergency', 'heart attack', 'bleeding', 'unconscious',
                  'first aid', 'medical', 'injured', 'fever', 'breathing problem',
                  'need doctor', 'need a doctor', 'hospital'],
      },
      {
        intent: 'lost',
        phrases: ['lost person', 'missing person', 'can\'t find my', 'lost my',
                  'missing child', 'lost child', 'separated from', 'looking for my',
                  'have you seen my', 'lost and found', 'missing', 'someone is lost'],
      },
      {
        intent: 'navigation',
        phrases: ['where is', 'how to get to', 'directions to', 'navigate to',
                  'route to', 'how do i reach', 'which way', 'show me the way',
                  'nearest gate', 'nearest ghat', 'how far is', 'location of'],
      },
    ];

    for (const rule of rules) {
      if (rule.phrases.some(phrase => text.includes(phrase))) {
        return rule.intent;
      }
    }

    return null;
  }

  async handleMessage(message) {
    const text = message.text.toLowerCase();

    this.log("📩 Received:", text);

    const intent = this.classifyIntent(text);

    switch (intent) {
      case 'medical':
        this.log("➡ Routing to MedicalAgent");
        this.publish("agent.medical", message);
        return;

      case 'lost':
        this.log("➡ Routing to LostPersonAgent");
        this.publish("agent.lost", message);
        return;

      case 'navigation':
        this.log("➡ Routing to NavigationAgent");
        this.publish("agent.navigation", message);
        return;

      default:
        this.log("➡ No intent matched — sending fallback reply");
        this.reply(
          message.userId,
          "I'm sorry, I didn't understand your request. You can ask me about:\n" +
          "• Medical emergencies (ambulance, first aid)\n" +
          "• Lost & found persons\n" +
          "• Directions & navigation"
        );
    }
  }
}

module.exports = TriageAgent;