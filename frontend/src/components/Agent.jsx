import { useSocket } from '../hooks/useSocket'
import { useState, useRef, useEffect } from 'react'

function Agent({ onNavigate, initialPrompt }) {
  const { isConnected, lastPong, lastReply, sendPing, sendMessage } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const prevPongRef = useRef(null);
  const prevReplyRef = useRef(null);
  const initialPromptSent = useRef(false);

  useEffect(() => {
    if (initialPrompt && !initialPromptSent.current && isConnected) {
      initialPromptSent.current = true;
      setMessages((prev) => [...prev, { role: 'user', text: initialPrompt }]);
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isConnected, sendMessage]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: message }]);

    if (message.toLowerCase() === 'ping') {
      sendPing();
    } else {
      sendMessage(message);
    }

    setMessage('');
  };

  useEffect(() => {
    if (lastPong && lastPong !== prevPongRef.current) {
      prevPongRef.current = lastPong;
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: `${lastPong.message} — ${new Date(lastPong.timestamp).toLocaleTimeString()}` },
      ]);
    }
  }, [lastPong]);

  useEffect(() => {
    if (lastReply && lastReply !== prevReplyRef.current) {
      prevReplyRef.current = lastReply;
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: lastReply.reply },
      ]);
    }
  }, [lastReply]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="app-container">
      {/* Top Header Section */}
      <div className="top-section" style={{ flex: 'none', height: '35vh', minHeight: '200px' }}>
        <div style={styles.topHeader}>
          <div style={styles.backButton} onClick={() => onNavigate('home')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Agent Chat</h2>
            <span style={{ fontSize: 13, color: isConnected ? '#4ade80' : '#fca5a5', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              {isConnected ? '🟢 Server Connected' : '🔴 Server Offline'}
            </span>
          </div>

          <div style={styles.iconCircle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
        </div>
      </div>

      {/* White Overlay Card for Chat */}
      <div className="white-overlay-card" style={{ padding: '0', flex: 1 }}>
        
        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <p style={styles.placeholder}>How can I help you today?</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={msg.role === 'user' ? styles.userBubble : styles.agentBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputRow}>
          <input
            id="chat-input"
            style={styles.input}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button id="send-button" style={styles.button} onClick={handleSend}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px',
  },
  backButton: {
    width: '44px', height: '44px', borderRadius: '50%', background: '#fff',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  iconCircle: {
    width: '44px', height: '44px', borderRadius: '50%', background: '#fff',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  chatBox: {
    flex: 1, overflowY: 'auto', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  placeholder: {
    textAlign: 'center', color: '#9ca3af', marginTop: '30%', fontSize: '1rem'
  },
  userBubble: {
    backgroundColor: '#ea580c', color: '#fff', padding: '14px 18px',
    borderRadius: '24px 24px 4px 24px', maxWidth: '75%', fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(234,88,12,0.25)'
  },
  agentBubble: {
    backgroundColor: '#f3f4f6', color: '#1f2937', padding: '14px 18px',
    borderRadius: '24px 24px 24px 4px', maxWidth: '75%', fontSize: '1rem',
    whiteSpace: 'pre-wrap', border: '1px solid #e5e7eb'
  },
  inputRow: {
    display: 'flex', gap: 12, padding: '16px 24px',
    borderTop: '1px solid #f3f4f6', backgroundColor: '#fff',
    borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px'
  },
  input: {
    flex: 1, padding: '14px 20px', borderRadius: '30px',
    border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
    color: '#1f2937', fontSize: '1rem', outline: 'none',
  },
  button: {
    width: '52px', height: '52px', borderRadius: '26px', border: 'none',
    backgroundColor: '#ea580c', color: '#fff', display: 'flex',
    justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(234,88,12,0.35)'
  },
};

export default Agent;
