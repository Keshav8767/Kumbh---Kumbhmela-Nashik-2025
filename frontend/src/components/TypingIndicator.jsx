import React from 'react';
import './TypingIndicator.css';

function TypingIndicator({ agentName = 'Agent' }) {
  return (
    <div className="message-row message-row-agent">
      <div className="agent-bubble typing-bubble">
        {agentName && (
          <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 'bold', marginBottom: '4px' }}>
            {agentName}
          </div>
        )}
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
