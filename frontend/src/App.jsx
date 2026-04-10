import React, { useState } from 'react';
import LanguageScreen from './components/LanguageScreen';
import MainInterface from './components/MainInterface';

function App() {
  const [screen, setScreen] = useState('home');

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
  };

  return (
    <div className="app-container">
      {screen === 'language' && <LanguageScreen onNavigate={navigate} />}
      {screen === 'home' && <MainInterface onNavigate={navigate} />}
    </div>
  );
}

export default App;
