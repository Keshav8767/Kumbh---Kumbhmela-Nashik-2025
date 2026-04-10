import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import MapMessage from './MapMessage';
import LocationCard from './LocationCard';
import TypingIndicator from './TypingIndicator';
import RouteMapMessage from './RouteMapMessage';
import './MainInterface.css';

function MainInterface({ onNavigate }) {
  const { isConnected, lastReply, activeAgent, sendMessage } = useSocket();
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

      {/* Mobile Layout */}
      {!hasStartedChatting && (
        <div className="mobile-layout">
          <div className="mobile-navbar">
            <div className="mobile-navbar-icons">
              <div className="mobile-navbar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div className="mobile-navbar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="mobile-navbar-icon notification-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="notification-badge">3</span>
              </div>
            </div>
            <h2 className="mobile-navbar-title">KUMBH</h2>
          </div>

          {/* Emergency Strip - Mobile */}
          <div className="emergency-strip">
            <div className="suggestion-marquee">
              <div className="marquee-content">
                <div className="suggestion-chip">🚨 Emergency: 108</div>
                <div className="suggestion-chip">👮 Police: 100</div>
                <div className="suggestion-chip">🚒 Fire: 101</div>
                <div className="suggestion-chip">🏥 Ambulance: 102</div>
                <div className="suggestion-chip">👶 Child Helpline: 1098</div>
                <div className="suggestion-chip">👩 Women Helpline: 1091</div>
                <div className="suggestion-chip">🚨 Emergency: 108</div>
                <div className="suggestion-chip">👮 Police: 100</div>
                <div className="suggestion-chip">🚒 Fire: 101</div>
                <div className="suggestion-chip">🏥 Ambulance: 102</div>
                <div className="suggestion-chip">👶 Child Helpline: 1098</div>
                <div className="suggestion-chip">👩 Women Helpline: 1091</div>
              </div>
            </div>
          </div>
          <div className="mobile-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
            <div className="mobile-input-wrap" style={{ marginTop: '0', marginBottom: '8px', width: '100%' }}>{renderInputBar(true)}</div>
            <div className="suggested-questions">
              <span onClick={() => handleSuggestionClick("When is the next Shahi Snan?")}>"When is the next Shahi Snan?"</span>
              <span onClick={() => handleSuggestionClick("Where is the lost and found?")}>"Where is the lost and found?"</span>
              <span onClick={() => handleSuggestionClick("How to reach Triveni Sangam?")}>"How to reach Triveni Sangam?"</span>
            </div>
          </div>

          {/* Emergency Strip - Mobile */}
          <div className="emergency-strip">
            <div className="suggestion-marquee">
              <div className="marquee-content">
                <div className="suggestion-chip">🚨 Emergency: 108</div>
                <div className="suggestion-chip">👮 Police: 100</div>
                <div className="suggestion-chip">🚒 Fire: 101</div>
                <div className="suggestion-chip">🏥 Ambulance: 102</div>
                <div className="suggestion-chip">👶 Child Helpline: 1098</div>
                <div className="suggestion-chip">👩 Women Helpline: 1091</div>
                <div className="suggestion-chip">🚨 Emergency: 108</div>
                <div className="suggestion-chip">👮 Police: 100</div>
                <div className="suggestion-chip">🚒 Fire: 101</div>
                <div className="suggestion-chip">🏥 Ambulance: 102</div>
                <div className="suggestion-chip">👶 Child Helpline: 1098</div>
                <div className="suggestion-chip">👩 Women Helpline: 1091</div>
              </div>
            </div>
          </div>
          
          {/* What We Provide Section - Mobile */}
          <div className="what-we-provide">
            <h3 className="section-title">What We Provide</h3>
            <div className="features-grid">
              <div className="feature-card" onClick={() => handleSuggestionClick("Tell me about Mahakumbh")}>
                <span className="feature-icon">🤖</span>
                <span className="feature-text">AI Companion</span>
              </div>
              <div className="feature-card" onClick={() => handleSuggestionClick("How do I reach the Triveni Sangam?")}>
                <span className="feature-icon">🗺️</span>
                <span className="feature-text">Maps & Routes</span>
              </div>
              <div className="feature-card" onClick={() => handleSuggestionClick("Where is the nearest medical camp?")}>
                <span className="feature-icon">🏥</span>
                <span className="feature-text">SOS & Medical</span>
              </div>
              <div className="feature-card" onClick={() => handleSuggestionClick("Help me find a lost person")}>
                <span className="feature-icon">🔍</span>
                <span className="feature-text">Lost & Found</span>
              </div>
            </div>
          </div>
          
          {/* Mobile minimal video section below the hero body */}
          <div className="minimal-video-strip">
            <div className="minimal-video-header">
              <span className="minimal-video-title">Kumbh Mela Videos</span>
            </div>
            <div className="minimal-video-scroll">
              {[
                { id: 'fSTgOP_q_E0', label: 'Kumbh Mela Guide' },
                { id: 'ouUZ8R2F810', label: 'Nashik Vlog' },
                { id: 'f7Y7A9Rgn-A', label: 'Overview' },
              ].map((v) => (
                <div key={v.id} className="minimal-video-card">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.label}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="minimal-video-label">{v.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Always visible but slides up */}
      <div className={`pristine-layout desktop-only ${hasStartedChatting ? 'slide-up' : ''}`}>

        {/* Desktop Navbar */}
        <div className="desktop-navbar">
          <h2 className="desktop-navbar-title">KUMBH</h2>
          <div className="desktop-navbar-icons">
            <div className="desktop-navbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div className="desktop-navbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div className="desktop-navbar-icon notification-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="desktop-notification-badge">3</span>
            </div>
          </div>
        </div>

        {/* Emergency Strip - Desktop */}
        <div className="emergency-strip desktop-emergency-strip">
          <div className="suggestion-marquee">
            <div className="marquee-content">
              <div className="suggestion-chip">🚨 Emergency: 108</div>
              <div className="suggestion-chip">👮 Police: 100</div>
              <div className="suggestion-chip">🚒 Fire: 101</div>
              <div className="suggestion-chip">🏥 Ambulance: 102</div>
              <div className="suggestion-chip">👶 Child Helpline: 1098</div>
              <div className="suggestion-chip">👩 Women Helpline: 1091</div>
              <div className="suggestion-chip">🚨 Emergency: 108</div>
              <div className="suggestion-chip">👮 Police: 100</div>
              <div className="suggestion-chip">🚒 Fire: 101</div>
              <div className="suggestion-chip">🏥 Ambulance: 102</div>
              <div className="suggestion-chip">👶 Child Helpline: 1098</div>
              <div className="suggestion-chip">👩 Women Helpline: 1091</div>
            </div>
          </div>
        </div>

        {/* Desktop Body */}
        <div className="desktop-body" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div className="desktop-input-wrap" style={{ marginTop: '0', maxWidth: '800px', width: '100%', alignSelf: 'center', marginBottom: '12px' }}>{renderInputBar(true)}</div>
          <div className="suggested-questions">
            <span onClick={() => handleSuggestionClick("When is the next Shahi Snan?")}>"When is the next Shahi Snan?"</span>
            <span onClick={() => handleSuggestionClick("Where is the lost and found?")}>"Where is the lost and found?"</span>
            <span onClick={() => handleSuggestionClick("How to reach Triveni Sangam?")}>"How to reach Triveni Sangam?"</span>
            <span onClick={() => handleSuggestionClick("Where are the medical camps?")}>"Where are the medical camps?"</span>
          </div>
        </div>

        {/* What We Provide Section - Desktop */}
        <div className="what-we-provide desktop-features-section">
          <h3 className="section-title">What We Provide</h3>
          <div className="features-grid">
            <div className="feature-card" onClick={() => handleSuggestionClick("Tell me about Mahakumbh")}>
              <span className="feature-icon">🤖</span>
              <span className="feature-text">AI Companion</span>
              <span className="feature-desc">Multilingual voice & chat support for your journey</span>
            </div>
            <div className="feature-card" onClick={() => handleSuggestionClick("How do I reach the Triveni Sangam?")}>
              <span className="feature-icon">🗺️</span>
              <span className="feature-text">Interactive Maps</span>
              <span className="feature-desc">Live routing to Ghats, camps, and transit hubs</span>
            </div>
            <div className="feature-card" onClick={() => handleSuggestionClick("Where is the nearest medical camp?")}>
              <span className="feature-icon">🏥</span>
              <span className="feature-text">SOS & Triage</span>
              <span className="feature-desc">Instant connection to nearby medical facilities</span>
            </div>
            <div className="feature-card" onClick={() => handleSuggestionClick("Help me find a lost person")}>
              <span className="feature-icon">🔍</span>
              <span className="feature-text">Lost & Found</span>
              <span className="feature-desc">Real-time reporting and finding missing persons</span>
            </div>
          </div>
        </div>

        {/* Minimal Video Section placed right above Desktop Footer */}
        <div className="minimal-video-strip">
          <div className="minimal-video-header">
            <span className="minimal-video-title">Kumbh Mela Videos</span>
          </div>
          <div className="minimal-video-scroll">
            {[
              { id: 'fSTgOP_q_E0', label: 'Kumbh Mela Guide' },
              { id: 'ouUZ8R2F810', label: 'Nashik Vlog' },
              { id: 'f7Y7A9Rgn-A', label: 'Overview' },
            ].map((v) => (
              <div key={v.id} className="minimal-video-card">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.label}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="minimal-video-label">{v.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="desktop-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>About Kumbh</h4>
              <p>The largest spiritual gathering on Earth</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <p>Events | Schedule | Map | Contact</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@kumbh2025.in</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Kumbh Mela Nashik. All rights reserved.</p>
          </div>
        </div>

        {/* Top Half Image */}
        <div className="hero-image-half" style={{display: 'none'}}>
          <div className="constrained-wrapper" style={{display: 'none'}}>
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
        <div className="white-overlay-card white-bottom-section" style={{display: 'none'}}>

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
                {isTyping && (
                  <div className="message-row message-row-agent">
                    <div className="agent-bubble" style={{ minWidth: '220px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotating-gear"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Main AI Thinking...
                      </div>
                      {activeAgent ? (
                        <div className="agent-visualization">
                          <div className="agent-assigned-badge">
                            <span className="agent-check">✓</span> Task identified
                          </div>
                          <div className="agent-handoff">
                            Routing to <strong>{activeAgent.name}</strong>...
                            {activeAgent.type === 'medical' && ' 🏥'}
                            {activeAgent.type === 'navigation' && ' 🗺️'}
                            {activeAgent.type === 'lost-and-found' && ' 🔍'}
                          </div>
                          <TypingIndicator />
                        </div>
                      ) : (
                        <div className="agent-visualization">
                          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '8px' }}>
                            Analyzing your request...
                          </div>
                          <TypingIndicator />
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
