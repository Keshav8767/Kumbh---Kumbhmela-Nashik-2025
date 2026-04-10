import React from 'react';

function LanguageScreen({ onNavigate }) {
  const languages = [
    { id: 'en', label: 'English', selected: true },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ' },
    { id: 'te', label: 'తెలుగు' },
    { id: 'mr', label: 'मराठी' },
    { id: 'ta', label: 'தமிழ்' },
    { id: 'gu', label: 'ગુજરાતી' },
    { id: 'ml', label: 'മലയാളം' },
    { id: 'kn', label: 'ಕನ್ನಡ' },
    { id: 'bn', label: 'বাংলা' },
    { id: 'ur', label: 'اردو' },
  ];

  return (
    <div className="app-container">
      {/* Top Header Section */}
      <div className="top-section">
        <div className="constrained-wrapper">
          <div style={styles.topHeader}>
            <div style={styles.iconCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style={styles.iconOval}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card perfectly snapping to the bottom */}
      <div className="white-overlay-card" style={{ position: 'relative' }}>
        
        <div className="constrained-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Floating Center Icon */}
          <div style={styles.centerFloatingIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h1 className="heading-title">Milan <span className="orange-text">AI</span></h1>
            <p className="heading-subtitle">Select Language</p>
          </div>

          {/* Language Grid */}
          <div style={styles.responsiveGrid} className="responsive-grid-lang">
            {languages.map(lang => (
              <button key={lang.id} style={{
                ...styles.langButton,
                backgroundColor: lang.selected ? '#ea580c' : 'transparent',
                color: lang.selected ? '#fff' : '#4b5563',
                borderColor: lang.selected ? '#ea580c' : '#d1d5db'
              }}>
                {lang.label}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div style={styles.nextContainer}>
            <button style={styles.nextButton} onClick={() => onNavigate('home')}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .responsive-grid-lang {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          padding: 0 24px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px',
  },
  iconCircle: {
    width: '44px', height: '44px', borderRadius: '50%', background: '#fff',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  iconOval: {
    width: '56px', height: '44px', borderRadius: '22px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  centerFloatingIcon: {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '4px solid #fcefe3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  responsiveGrid: {
    marginTop: '32px',
    flex: 1,
  },
  langButton: {
    padding: '12px 8px',
    borderRadius: '24px',
    border: '1px solid',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '100px'
  },
  nextContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    paddingBottom: '24px'
  },
  nextButton: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#ea580c',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(234, 88, 12, 0.4)'
  }
};

export default LanguageScreen;
