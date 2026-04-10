class BaseAgent {
    constructor(bus) {
        this.bus = bus;
        this.agentName = "BaseAgent";
    }

    // 📩 Override this in child agents
    async handleMessage(message) {
        throw new Error("handleMessage() must be implemented in child agent");
    }

    // 📢 Publish event
    publish(event, data) {
        this.bus.publish(event, data);
    }

    // 📡 Subscribe to event
    subscribe(event, handler) {
        this.bus.subscribe(event, handler);
    }

    // 🧾 Logging helper
    log(...args) {
        console.log(`[${this.agentName}]`, ...args);
    }

    // 📤 Send reply to frontend
    reply(userId, text, socketId) {
        this.publish("message.reply", {
            userId,
            reply: text,
            socketId
        });
    }
}

module.exports = BaseAgent;