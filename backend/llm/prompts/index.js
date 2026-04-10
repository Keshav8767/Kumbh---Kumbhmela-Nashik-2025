/**
 * MilanAI — LLM Prompt Templates
 *
 * These prompts are used by specialist agents when calling the Anthropic API.
 * Each function returns a structured prompt string for a specific agent type.
 */

const systemPrompt = `You are MilanAI, an AI assistant designed to help pilgrims
at the Kumbh Mela festival. You are knowledgeable about:
- Medical emergencies and nearby first-aid / hospital locations
- Lost and found persons — matching descriptions, coordinating reunions
- Navigation between ghats, gates, temples, and key zones
- Ritual schedules, bathing times, and religious ceremonies

Always respond in a calm, helpful, and culturally sensitive manner.
If the situation is urgent (medical emergency, lost child), prioritize
actionable information like nearest medical post or volunteer contact.`;

function medicalPrompt(userMessage, context = {}) {
  return {
    system: systemPrompt,
    user: `A pilgrim is reporting a medical issue:\n"${userMessage}"\n\n` +
      (context.nearestPost ? `Nearest medical post: ${context.nearestPost}\n` : '') +
      (context.zone ? `Current zone: ${context.zone}\n` : '') +
      `\nProvide immediate guidance and the nearest medical facility.`,
  };
}

function lostPersonPrompt(userMessage, context = {}) {
  return {
    system: systemPrompt,
    user: `A pilgrim is reporting a lost/missing person:\n"${userMessage}"\n\n` +
      (context.matchingCases ? `Possible matches in database: ${JSON.stringify(context.matchingCases)}\n` : '') +
      `\nHelp gather details and check for potential matches.`,
  };
}

function navigationPrompt(userMessage, context = {}) {
  return {
    system: systemPrompt,
    user: `A pilgrim needs directions:\n"${userMessage}"\n\n` +
      (context.zones ? `Available zones: ${context.zones.join(', ')}\n` : '') +
      `\nProvide clear, step-by-step navigation guidance.`,
  };
}

module.exports = { systemPrompt, medicalPrompt, lostPersonPrompt, navigationPrompt };
