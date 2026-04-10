import React from 'react';

function HomeScreen({ onNavigate }) {
  const launchChat = (topic) => {
    onNavigate('chat', topic);
  };

  return (
    <div className="app-container">
      {/* Top Header Section */}
      <div className="top-section">
        <div>
          <div style={styles.topHeader}>
            <div style={styles.iconCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <div style={styles.langSelector}>
              <span>English</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div style={styles.exitIcon} onClick={() => onNavigate('language')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
          </div>

          <div style={{ padding: '0 24px', textAlign: 'center', marginTop: '10px' }}>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>Kumbh Sah'Al'yak</h2>
            <p style={{ margin: 0, color: '#ffedd5', fontSize: '0.9rem', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>Your Personal Guide to Mahakumbh 2025</p>
          </div>
        </div>

        {/* Banner Card placed nicely at bottom of top section using flex layout */}
        <div style={styles.bannerCardContainer}>
          <div style={styles.bannerCard}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#1f2937', fontSize: '1.1rem', lineHeight: '1.2' }}>Shri Yogi Adityanath ji</h3>
              <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '0.8rem' }}>Special Message for You</p>
              <button style={styles.bannerButton}>
                Click to View
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" style={{ marginLeft: 4 }}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              </button>
            </div>
            <div style={styles.profilePic}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
        </div>
      </div>

      {/* White Overlay Card */}
      <div className="white-overlay-card">
        <p className="heading-subtitle" style={{ fontSize: '0.95rem', marginBottom: '16px', marginTop: '30px' }}>What do you want to know about?</p>
        
        {/* Features Grid */}
        <div className="responsive-grid-home" style={styles.gridContainer}>
          <GridItem icon="sun" title="About Mahakumbh" onClick={() => launchChat("Tell me about Mahakumbh")} />
          <GridItem icon="heart" title="Public Facilities" onClick={() => launchChat("What medical facilities are available?")} />
          <GridItem icon="map" title="Travel & Accomm." onClick={() => launchChat("How do I travel within Kumbh?")} />
          <GridItem icon="briefcase" title="Tour Packages" onClick={() => launchChat("What tour packages are available?")} />
        </div>
      </div>

      <style>{`
        .responsive-grid-home {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          height: 100%;
          overflow-y: auto;
          padding-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

function GridItem({ icon, title, onClick }) {
  const renderIcon = () => {
    switch(icon) {
      case 'sun': return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
      case 'heart': return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
      case 'map': return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
      case 'briefcase': return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
      default: return null;
    }
  }

  return (
    <div style={styles.gridItem} onClick={onClick}>
      <div style={{ marginBottom: 12 }}>{renderIcon()}</div>
      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4b5563', lineHeight: '1.2', textAlign: 'center' }}>{title}</span>
      <div style={styles.gridItemArrow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>
    </div>
  )
}

const styles = {
  topHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 24px',
  },
  iconCircle: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#fff',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  langSelector: {
    background: 'rgba(255,255,255,0.95)', borderRadius: '24px',
    padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '0.9rem', fontWeight: 'bold', color: '#ea580c', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  exitIcon: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#fff',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
  },
  bannerCardContainer: {
    padding: '0 24px',
    marginBottom: '-60px', /* Allow it to overlap the white card beneath */
    zIndex: 10
  },
  bannerCard: {
    background: '#fff', borderRadius: '24px', padding: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  profilePic: {
    width: '70px', height: '70px', borderRadius: '50%', background: '#fcefe3',
    display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #ffedd5'
  },
  bannerButton: {
    display: 'flex', alignItems: 'center', background: 'transparent',
    border: 'none', color: '#ea580c', fontSize: '0.85rem', fontWeight: '700',
    padding: 0, cursor: 'pointer'
  },
  gridContainer: {
    marginTop: '30px', /* To account for the overlapping banner */
  },
  gridItem: {
    border: '1px solid #fed7aa', borderRadius: '24px', padding: '20px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    position: 'relative', cursor: 'pointer', background: '#fff',
    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.05)', transition: 'transform 0.2s',
    minHeight: '140px'
  },
  gridItemArrow: {
    position: 'absolute', bottom: '12px', right: '12px',
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#ffedd5', display: 'flex', justifyContent: 'center', alignItems: 'center'
  }
};

export default HomeScreen;
