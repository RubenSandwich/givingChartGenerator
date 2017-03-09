import React from 'react'
import ReactDOM from 'react-dom'
import Canvas from 'react-canvas-component'

function drawCanvas({ctx, time}) {
    const {width, height} = ctx.canvas
    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'black'
    ctx.translate(width / 2, height / 2)
    ctx.fillRect(-1 * width / 4, -1 * height / 4, width / 2, height / 2)
    ctx.restore()
}

const GivingChart = (props) => {
  return (
    <Canvas
    draw={drawCanvas}
    width={400}
    height={200}
    />
  );
}

export default GivingChart;
