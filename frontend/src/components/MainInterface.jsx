import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import MapMessage from './MapMessage';
import LocationCard from './LocationCard';
import TypingIndicator from './TypingIndicator';
import RouteMapMessage from './RouteMapMessage';
import './MainInterface.css';

function MainInterface({ onNavigate }) {
  const { isConnected, lastReply, sendMessage } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const bottomRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const prevReplyRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (lastReply && lastReply !== prevReplyRef.current) {
      prevReplyRef.current = lastReply;
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: 'agent', ...lastReply }]);
    }
  }, [lastReply]);

  const handleSend = (textToSend = message) => {
    if (!textToSend.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setIsTyping(true);
    sendMessage(textToSend, userLocation, selectedLanguage);
    setMessage('');
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice functionality is currently supported in Chrome and Safari. Please type your request!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      handleSend(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSuggestionClick = (promptText) => {
    setMessage(promptText);
  };

  const hasStartedChatting = messages.length > 0;

  // Smooth transition effect
  useEffect(() => {
    if (hasStartedChatting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [hasStartedChatting]);

  // Render the Input Bar
  const renderInputBar = (isCenterpiece) => (
    <div className={`input-wrapper ${isCenterpiece ? 'input-wrapper-centerpiece' : 'input-wrapper-normal'} ${isShaking ? 'shake-animation' : ''} ${!isConnected ? 'input-wrapper-disabled' : ''}`}>
      <button
        className={`big-mic-button ${isRecording ? 'big-mic-button-recording' : ''}`}
        onClick={startVoiceInput}
        title="Tap to speak"
      >
        {isRecording ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="6"></rect><circle cx="12" cy="12" r="10"></circle></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
        )}
      </button>

      <input
        className="text-input"
        type="text"
        placeholder={!isConnected ? "Connecting to server..." : (isRecording ? "Listening..." : "Ask me anything...")}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={!isConnected}
      />

      <button className="send-button" onClick={() => handleSend()} disabled={!isConnected || isShaking}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  );

  return (
    <div className="app-container" style={{ overflowY: 'auto', position: 'relative' }}>

      {/* Hero Section - Always visible but slides up */}
      <div className={`pristine-layout ${hasStartedChatting ? 'slide-up' : ''}`}>

        {/* Top Half Image */}
        <div className="hero-image-half">
          <div className="constrained-wrapper">
            <div className="top-header">
              <div className="lang-selector" onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
                <span>{selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'हिन्दी' : selectedLanguage === 'mr' ? 'मराठी' : 'English'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              {showLanguageMenu && (
                <div style={{
                  position: 'absolute',
                  top: '70px',
                  right: '24px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  padding: '8px',
                  zIndex: 1000,
                  minWidth: '150px'
                }}>
                  {['English', 'हिन्दी', 'मराठी', 'ગુજરાતી', 'தமிழ்'].map((lang) => (
                    <div
                      key={lang}
                      onClick={() => {
                        const langCode = lang === 'English' ? 'en' : lang === 'हिन्दी' ? 'hi' : lang === 'मराठी' ? 'mr' : lang === 'ગુજરાતી' ? 'gu' : 'ta';
                        setSelectedLanguage(langCode);
                        setShowLanguageMenu(false);
                      }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hero-bottom-section">
            <h2 className="hero-title">KUMBH <span className="orange-text">NASHIK</span></h2>
          </div>
        </div>

        {/* Bottom Half (Solid White) */}
        <div className="white-overlay-card white-bottom-section">

          {/* Center Straddling Input Box */}
          <div className="input-straddle-container">
            {renderInputBar(true)}
          </div>

          {/* Four Suggested Prompts (Cube Grid) */}
          {!hasStartedChatting && (
            <div className="info-grid">
              <InfoBlock icon="calendar" title="When are the main Shahi Snan dates?" desc="When are the main Shahi Snan dates?" onClick={() => handleSuggestionClick("When are the main Shahi Snan dates?")} />
              <InfoBlock icon="activity" title="Where is the nearest medical camp?" desc="Where is the nearest medical camp?" onClick={() => handleSuggestionClick("Where is the nearest medical camp?")} />
              <InfoBlock icon="map" title="How do I reach the Triveni Sangam?" desc="How do I reach the Triveni Sangam?" onClick={() => handleSuggestionClick("How do I reach the Triveni Sangam?")} />
              <InfoBlock icon="search" title="Help me find a lost person." desc="Help me find a lost person." onClick={() => handleSuggestionClick("Help me find a lost person.")} />
            </div>
          )}
        </div>

      </div>

      {/* Chat Overlay - Slides in from bottom */}
      {hasStartedChatting && (
        <div className="chat-overlay">
          <div className="constrained-wrapper chat-container">

            <div className="chat-header">
              <div className="icon-circle icon-circle-gray" onClick={() => setMessages([])}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </div>
              <span className="chat-title">Milan AI Companion</span>
            </div>

            <div className="scroll-area" ref={scrollAreaRef}>
              <div className="chat-history">
                {messages.map((msg, i) => (
                  <div key={i} className={`message-row ${msg.role === 'user' ? 'message-row-user' : 'message-row-agent'}`}>
                    <div className={msg.role === 'user' ? 'user-bubble' : 'agent-bubble'}>
                      {msg.role === 'agent' && msg.agent && (
                        <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 'bold', marginBottom: '4px' }}>
                          {msg.agent}
                        </div>
                      )}
                      {msg.text || msg.reply}
                      
                      {msg.showRoute && msg.routeData && (
                        <RouteMapMessage 
                          start={msg.routeData.start}
                          end={msg.routeData.end}
                          startName={msg.routeData.startName}
                          endName={msg.routeData.endName}
                          distance={msg.routeData.distance}
                          duration={msg.routeData.duration}
                        />
                      )}
                      
                      {msg.showMap && msg.locations && (
                        <>
                          <MapMessage 
                            locations={msg.locations} 
                            center={msg.locations[0]?.coordinates}
                            userLocation={msg.userLocation}
                          />
                          <div style={{ marginTop: '12px' }}>
                            {msg.locations.slice(0, 3).map((loc, idx) => (
                              <LocationCard key={idx} location={loc} />
                            ))}
                          </div>
                        </>
                      )}
                      
                      {msg.needsLocation && (
                        <button 
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((pos) => {
                                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                                handleSend('I am at my current location');
                              });
                            }
                          }}
                          style={{
                            marginTop: '12px',
                            padding: '10px 16px',
                            background: '#ea580c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          📍 Share My Location
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator agentName="Milan AI" />}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="input-anchor">
              {renderInputBar(false)}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// Component: Informational Blocks (2x2 Square Widget Grid)
// -------------------------------------------------------------
function InfoBlock({ icon, title, desc, onClick }) {
  const getIconSvg = () => {
    switch (icon) {
      case 'users': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      case 'calendar': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'activity': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
      case 'search': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
      case 'map': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>;
      default: return null;
    }
  };

  return (
    <div className="info-block" onClick={onClick}>
      <div className="info-block-icon">{getIconSvg()}</div>
      <div className="info-block-title">{title}</div>
      <div className="info-block-desc">{desc}</div>
    </div>
  );
}

export default MainInterface;
