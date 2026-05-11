//
// Mass Simulator
// Deepak Shenoy
// May 10th, 2026
//
// Page to display Particle Lenia
// Adapted from https://observablehq.com/@znah/particle-lenia-from-scratch
// More work to be done - bugs and the simulation doesn't have
// the particles coalescing correctly
//
import { useState, useEffect, useRef } from 'react'
import { APP_WIDTH, APP_HEIGHT } from './constants'

// Particle Lenia parameters
const NUM_PARTICLES = 300
const DT = 0.1
const BETA = 0.3        // growth center
const MU = 0.4          // peak of kernel

// Bell-shaped growth function
function growth(x, sigma, mu) {
  return 2.0 * Math.exp(-((x - mu) * (x - mu)) / (2 * sigma * sigma)) - 1
}

// Kernel function - how strongly particles interact at distance r
function kernel(r) {
  if (r >= 1.0) return 0
  return Math.exp(4.0 - 1.0 / (r * (1.0 - r)))
}

function initParticles(width, height, count) {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    })
  }
  return particles
}

function stepSimulation(particles, width, height, rMax, sigma, mu) {
  const forces = particles.map(() => ({ fx: 0, fy: 0 }))

  for (let i = 0; i < particles.length; i++) {
    let totalWeight = 0
    let weightedFx = 0
    let weightedFy = 0

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue

      let dx = particles[j].x - particles[i].x
      let dy = particles[j].y - particles[i].y

      // Wrap around (toroidal space)
      if (dx > width / 2) dx -= width
      if (dx < -width / 2) dx += width
      if (dy > height / 2) dy -= height
      if (dy < -height / 2) dy += height

      const dist = Math.sqrt(dx * dx + dy * dy)
      const normDist = dist / rMax

      if (normDist >= 1.0 || normDist < 0.01) continue

      const k = kernel(normDist)
      totalWeight += k

      const direction_x = dx / dist
      const direction_y = dy / dist

      weightedFx += k * direction_x
      weightedFy += k * direction_y
    }

    if (totalWeight > 0) {
      const avgDensity = totalWeight / particles.length
      const g = growth(avgDensity, sigma, mu)

      forces[i].fx = g * weightedFx
      forces[i].fy = g * weightedFy
    }
  }

  // Update positions
  for (let i = 0; i < particles.length; i++) {
    particles[i].vx = forces[i].fx * rMax
    particles[i].vy = forces[i].fy * rMax

    particles[i].x += particles[i].vx * DT
    particles[i].y += particles[i].vy * DT

    // Wrap around
    particles[i].x = ((particles[i].x % width) + width) % width
    particles[i].y = ((particles[i].y % height) + height) % height
  }
}

function Particles() {
  const [numParticles, setNumParticles] = useState('300')
  const [rMax, setRMax] = useState('80')
  const [sigma, setSigma] = useState('0.15')
  const [mu, setMu] = useState('0.4')
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)
  const animRef = useRef(null)
  const rMaxRef = useRef(80)
  const sigmaRef = useRef(0.15)
  const muRef = useRef(0.4)

  function startAnimation() {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    function animate() {
      stepSimulation(particlesRef.current, APP_WIDTH, APP_HEIGHT, rMaxRef.current, sigmaRef.current, muRef.current)

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, APP_WIDTH, APP_HEIGHT)

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const hue = (speed * 2) % 360

        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  function handleParticleCountChange(e) {
    const count = e.target.value
    setNumParticles(count)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    particlesRef.current = initParticles(APP_WIDTH, APP_HEIGHT, parseInt(count))
    startAnimation()
  }

  function handleRadiusChange(e) {
    const val = e.target.value
    setRMax(val)
    rMaxRef.current = parseInt(val)
  }

  function handleSigmaChange(e) {
    const val = e.target.value
    setSigma(val)
    sigmaRef.current = parseFloat(val)
  }

  function handleMuChange(e) {
    const val = e.target.value
    setMu(val)
    muRef.current = parseFloat(val)
  }

  useEffect(() => {
    particlesRef.current = initParticles(APP_WIDTH, APP_HEIGHT, parseInt(numParticles))
    startAnimation()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Particle Lenia</h1>
      <label>Particles: </label>
      <select value={numParticles} onChange={handleParticleCountChange}>
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="150">150</option>
        <option value="200">200</option>
        <option value="250">250</option>
        <option value="300">300</option>
      </select>
      <label style={{ marginLeft: '10px' }}>Interaction Radius: </label>
      <select value={rMax} onChange={handleRadiusChange}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="40">40</option>
        <option value="80">80</option>
        <option value="100">100</option>
        <option value="150">150</option>
        <option value="200">200</option>
      </select>
      <label style={{ marginLeft: '10px' }}>Sigma: </label>
      <select value={sigma} onChange={handleSigmaChange}>
        <option value="0.05">0.05</option>
        <option value="0.10">0.10</option>
        <option value="0.15">0.15</option>
        <option value="0.20">0.20</option>
        <option value="0.25">0.25</option>
      </select>
      <label style={{ marginLeft: '10px' }}>Mu: </label>
      <select value={mu} onChange={handleMuChange}>
        <option value="0.1">0.1</option>
        <option value="0.2">0.2</option>
        <option value="0.3">0.3</option>
        <option value="0.4">0.4</option>
        <option value="0.5">0.5</option>
        <option value="0.6">0.6</option>
        <option value="0.7">0.7</option>
        <option value="0.8">0.8</option>
      </select>

      <canvas
        ref={canvasRef}
        width={APP_WIDTH}
        height={APP_HEIGHT}
        style={{ display: 'block', marginTop: '20px', border: '1px solid gray', backgroundColor: '#000' }}
      />
    </div>
  )
}

export default Particles
