//
// Mass Simulator
// Deepak Shenoy
// May 10th, 2026
//
// Page to display the collision balls
// Code modified from https://plnkr.co/edit/KWsBiJGccbqVZgZFNieP?p=preview&preview
//
import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { APP_WIDTH, APP_HEIGHT } from './constants'

function Ball(svg, x, y, id, color, aoa, weight) {
  this.posX = x
  this.posY = y
  this.color = color
  this.radius = weight || 10
  this.jumpSize = 1
  this.svg = svg
  this.id = id
  this.aoa = aoa || Math.PI / 7
  this.weight = weight || 10
  this.data = [this.id]

  var thisobj = this
  this.vx = Math.cos(thisobj.aoa) * thisobj.jumpSize
  this.vy = Math.sin(thisobj.aoa) * thisobj.jumpSize
  this.initialVx = this.vx
  this.initialVy = this.vy
  this.initialPosX = this.posX
  this.initialPosY = this.posY

  this.GoToInitialSettings = function (newjumpSize) {
    thisobj.posX = thisobj.initialPosX
    thisobj.posY = thisobj.initialPosY
    thisobj.vx = Math.cos(thisobj.aoa) * newjumpSize
    thisobj.vy = Math.sin(thisobj.aoa) * newjumpSize
    thisobj.Draw()
  }

  this.Draw = function () {
    var ball = thisobj.svg.selectAll('#' + thisobj.id).data(thisobj.data)
    ball.enter()
      .append('circle')
      .attr('id', thisobj.id)
      .attr('class', 'ball')
      .attr('r', thisobj.radius)
      .attr('weight', thisobj.weight)
      .style('fill', thisobj.color)
    ball.attr('cx', thisobj.posX).attr('cy', thisobj.posY)

    ball.enter()
      .append('circle')
      .attr('id', thisobj.id + '_intersect')
      .attr('class', 'intersectBall')
  }

  this.Move = function () {
    thisobj.posX += thisobj.vx
    thisobj.posY += thisobj.vy

    var w = parseInt(thisobj.svg.attr('width'))
    var h = parseInt(thisobj.svg.attr('height'))

    if (w <= thisobj.posX + thisobj.radius) {
      thisobj.posX = w - thisobj.radius - 1
      thisobj.aoa = Math.PI - thisobj.aoa
      thisobj.vx = -thisobj.vx
    }
    if (thisobj.posX < thisobj.radius) {
      thisobj.posX = thisobj.radius + 1
      thisobj.aoa = Math.PI - thisobj.aoa
      thisobj.vx = -thisobj.vx
    }
    if (h < thisobj.posY + thisobj.radius) {
      thisobj.posY = h - thisobj.radius - 1
      thisobj.aoa = 2 * Math.PI - thisobj.aoa
      thisobj.vy = -thisobj.vy
    }
    if (thisobj.posY < thisobj.radius) {
      thisobj.posY = thisobj.radius + 1
      thisobj.aoa = 2 * Math.PI - thisobj.aoa
      thisobj.vy = -thisobj.vy
    }

    if (thisobj.aoa > 2 * Math.PI) thisobj.aoa -= 2 * Math.PI
    if (thisobj.aoa < 0) thisobj.aoa += 2 * Math.PI

    thisobj.Draw()
  }
}

function CheckCollision(ball1, ball2) {
  var absx = Math.abs(ball2.posX - ball1.posX)
  var absy = Math.abs(ball2.posY - ball1.posY)
  var distance = Math.sqrt(absx * absx + absy * absy)
  return distance < (ball1.radius + ball2.radius)
}

function ProcessCollision(balls, svg, i, j) {
  if (j <= i) return
  if (i >= balls.length - 1 || j >= balls.length) return

  var ball1 = balls[i]
  var ball2 = balls[j]

  if (CheckCollision(ball1, ball2)) {
    ball1.aoa = Math.PI / (Math.floor(Math.random() * 10) + 1)
    ball2.aoa = Math.PI / (Math.floor(Math.random() * 10) + 1)

    var interx = (ball1.posX * ball2.radius + ball2.posX * ball1.radius) / (ball1.radius + ball2.radius)
    var intery = (ball1.posY * ball2.radius + ball2.posY * ball1.radius) / (ball1.radius + ball2.radius)

    var intersectBall = svg.select('#' + ball1.id + '_intersect')
    intersectBall.attr('cx', interx).attr('cy', intery).attr('r', 5).attr('fill', 'black')
      .transition().duration(500).attr('r', 0)

    var vx1 = (ball1.vx * (ball1.weight - ball2.weight) + 2 * ball2.weight * ball2.vx) / (ball1.weight + ball2.weight)
    var vy1 = (ball1.vy * (ball1.weight - ball2.weight) + 2 * ball2.weight * ball2.vy) / (ball1.weight + ball2.weight)
    var vx2 = (ball2.vx * (ball2.weight - ball1.weight) + 2 * ball1.weight * ball1.vx) / (ball1.weight + ball2.weight)
    var vy2 = (ball2.vy * (ball2.weight - ball1.weight) + 2 * ball1.weight * ball1.vy) / (ball1.weight + ball2.weight)

    ball1.vx = vx1
    ball1.vy = vy1
    ball2.vx = vx2
    ball2.vy = vy2

    while (CheckCollision(ball1, ball2)) {
      ball1.posX += ball1.vx
      ball1.posY += ball1.vy
      ball2.posX += ball2.vx
      ball2.posY += ball2.vy
    }
    ball1.Draw()
    ball2.Draw()
  }
}

var colorScale = d3.scaleOrdinal(d3.schemeCategory10)

function createBalls(svg, count) {
  var defaults = [
    { x: 501, y: 101, id: 'n1', color: 'red', aoa: Math.PI / 6, weight: 10 },
    { x: 51, y: 31, id: 'n2', color: 'green', aoa: Math.PI / 3, weight: 20 },
    { x: 201, y: 201, id: 'n3', color: 'yellow', aoa: Math.PI / 9, weight: 90 },
    { x: 91, y: 31, id: 'n4', color: 'orange', aoa: Math.PI / 2, weight: 15 },
    { x: 201, y: 21, id: 'n5', color: 'pink', aoa: Math.PI + Math.PI / 4, weight: 15 },
    { x: 401, y: 41, id: 'n6', color: 'blue', aoa: Math.PI + Math.PI / 7, weight: 25 },
  ]

  var balls = []
  for (var i = 0; i < count; i++) {
    if (i < defaults.length) {
      var d = defaults[i]
      balls.push(new Ball(svg, d.x, d.y, d.id, d.color, d.aoa, d.weight))
    } else {
      balls.push(new Ball(svg, 101, 101, 'n' + (i + 1), colorScale(i), Math.PI / (i + 1), (i % 2) === 0 ? 10 : 10 + i))
    }
  }
  return balls
}

function CollisionBalls() {
  const [speed, setSpeed] = useState('1')
  const [numBalls, setNumBalls] = useState('6')
  const drawRef = useRef(null)
  const ballsRef = useRef([])
  const svgRef = useRef(null)
  const runningRef = useRef(null)

  function initSimulation(speedVal, ballCount) {
    if (!drawRef.current) return

    runningRef.current = false
    var el = drawRef.current

    d3.select(el).selectAll('*').remove()

    var svg = d3.select(el).append('svg')
      .attr('width', APP_WIDTH)
      .attr('height', APP_HEIGHT)
      .append('g')
      .attr('width', APP_WIDTH)
      .attr('height', APP_HEIGHT)

    svgRef.current = svg
    var balls = createBalls(svg, ballCount)
    for (var i = 0; i < balls.length; i++) balls[i].Draw()
    ballsRef.current = balls

    // Apply speed
    for (var i = 0; i < balls.length; i++) {
      balls[i].GoToInitialSettings(parseInt(speedVal))
    }

    runningRef.current = true
    d3.timer(function () {
      for (var i = 0; i < balls.length; i++) {
        balls[i].Move()
        for (var j = i + 1; j < balls.length; j++) {
          ProcessCollision(balls, svg, i, j)
        }
      }
      return !runningRef.current
    })
  }

  useEffect(() => {
    initSimulation(speed, parseInt(numBalls))
    return () => { runningRef.current = false }
  }, [])

  function handleSpeedChange(e) {
    var newSpeed = e.target.value
    setSpeed(newSpeed)
    initSimulation(newSpeed, parseInt(numBalls))
  }

  function handleNumBallsChange(e) {
    var newCount = e.target.value
    setNumBalls(newCount)
    initSimulation(speed, parseInt(newCount))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Collision Balls</h1>

      <label>Speed: </label>
      <select value={speed} onChange={handleSpeedChange}>
        <option value="1">Slow</option>
        <option value="3">Medium</option>
        <option value="5">Fast</option>
      </select>

      <label style={{ marginLeft: '10px' }}>Number of Balls: </label>
      <select value={numBalls} onChange={handleNumBallsChange}>
        <option value="6">6</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>

      <div ref={drawRef} style={{ width: `${APP_WIDTH}px`, height: `${APP_HEIGHT}px`, border: '1px solid gray', marginTop: '20px', backgroundColor: '#000' }} />
    </div>
  )
}

export default CollisionBalls
