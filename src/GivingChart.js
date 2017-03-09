
import React, { Component } from 'react';
import Canvas from 'react-canvas-component';

function drawCanvas({ctx, time}, props) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;

  ctx.clearRect(0, 0, width, height);

  // Titles //
  ctx.fillStyle= '#000';
  ctx.font = '30px Arial';
  ctx.fillText(year, 20, 40);
  ctx.fillText(month, 20, 100);

  // TODO: Remove magic numbers, refactor into functions
  // TODO: Move giving below budget if it's greater
  // TODO: If too small draw label outside of box
  const maxWidth = 250;

  let smallerWidth;
  let givingGreater;
  if (giving > budget) {
    givingGreater = true;
    smallerWidth = (budget / giving) * maxWidth;
  } else {
    givingGreater = false;
    smallerWidth = (giving / budget) * maxWidth;
  }

  // Giving Box //
  // Box
  ctx.strokeStyle= '#000';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 140, givingGreater ? maxWidth : smallerWidth, 100);

  // Text inside Box
  ctx.fillStyle= '#000';
  ctx.fillText('giving', 60, 200);

  // Text after box
  ctx.fillStyle= '#000';
  ctx.fillText(giving, 280, 200);


  // Budget Box //
  // Box
  ctx.fillStyle= '#000';
  ctx.fillRect(20, 250, givingGreater ? smallerWidth : maxWidth, 100);

  // Text inside Box
  ctx.fillStyle= '#FFF';
  ctx.fillText('budget', 60, 40 + 250);

  // Text after box
  ctx.fillStyle= '#000';
  ctx.fillText(budget, 280, 40 + 250);
}

class GivingChart extends Component {
  getImageData() {
    const canvas = this.refs.chart.refs.canvas;
    return canvas.toDataURL("image/png");
  }

  render() {
    const width = 400;
    const height = 200;

    return (
      <Canvas
        style={{
          width,
          height,
        }}
        ref="chart"
        draw={(args) => { drawCanvas(args, this.props) }}
        width={width * 2}
        height={height * 2}
      />
    );
  }
}

export default GivingChart;
