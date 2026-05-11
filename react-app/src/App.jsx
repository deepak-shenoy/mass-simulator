//
// Mass Simulator
// Deepak Shenoy
// May 10th, 2026
//
// Main React Application Component
//
import { useState } from 'react'
import MenuBar from './MenuBar'
import Particles from './Particles'
import CollisionBalls from './CollisionBalls'
import { APP_WIDTH, APP_HEIGHT } from './constants'

function App() {
  const [screen, setScreen] = useState('particles')
  const [showAbout, setShowAbout] = useState(false)

  function handleMenuSelect(menu, item) {
    if (menu === 'Help' && item === 'About') {
      setShowAbout(true)
    } else if (menu === 'Simulation' && item === 'Particles Lenia') {
      setScreen('particles')
    } else if (menu === 'Simulation' && item === 'Collision Balls') {
      setScreen('collisionballs')
    }
  }

  return (
    <div>
      <MenuBar onSelect={handleMenuSelect} />
      {screen === 'particles' && <Particles />}
      {screen === 'collisionballs' && <CollisionBalls />}

      {showAbout && (
        <div style={styles.overlay} onClick={() => setShowAbout(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>About</h2>
            <p>MassSim v1.0</p>
            <p>Built with Saucer + React</p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    minWidth: `${APP_WIDTH / 4}px`,
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
}

export default App
