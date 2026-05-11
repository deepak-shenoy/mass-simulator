//
// Mass Simulator
// Deepak Shenoy
// May 10th, 2026
// Menu Bar
//
import { useState } from 'react'

const menus = {
  File: ['New', 'Open', 'Save', 'Exit'],
  Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
  Simulation: ['Particles Lenia', 'Collision Balls'],
  View: ['Zoom In', 'Zoom Out', 'Fullscreen'],
  Help: ['About'],
}

function MenuBar({ onSelect }) {
  const [openMenu, setOpenMenu] = useState(null)

  return (
    <nav style={styles.nav}>
      {Object.entries(menus).map(([label, items]) => (
        <div
          key={label}
          style={styles.menuItem}
          onMouseEnter={() => setOpenMenu(label)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <span style={styles.menuLabel}>{label}</span>
          {openMenu === label && (
            <ul style={styles.dropdown}>
              {items.map(item => (
                <li
                  key={item}
                  style={styles.dropdownItem}
                  onClick={() => { setOpenMenu(null); onSelect && onSelect(label, item) }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    backgroundColor: '#333',
    padding: '0',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
  },
  menuItem: {
    position: 'relative',
  },
  menuLabel: {
    color: '#fff',
    padding: '8px 16px',
    display: 'block',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    minWidth: '120px',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '8px 16px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}

export default MenuBar
