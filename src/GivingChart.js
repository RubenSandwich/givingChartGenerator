
import React, { Component } from 'react';
import Canvas from 'react-canvas-component';


function drawCanvas({ ctx, time }, props) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;
  const givingNum = parseInt(giving, 10);
  const budgetNum = parseInt(budget, 10);

  // Titles //
  ctx.font = '24px Quattrocento Sans';


  // Generate char widths needed to simulate proportional figures
  const numsChars = '$1234567890,'
  const numCharWidths = numsChars.split('').reduce((result, item) => {
    result[item] =  ctx.measureText(item).width;
    return result;
  }, {});

  const longestNumWidth = Object.keys(numCharWidths).reduce((result, item) => {
    return result > numCharWidths[item] ? result : numCharWidths[item];
  }, 0);

  const wordWidths = ['Giving', 'Budget'].reduce((result, item) => {
    result[item] =  ctx.measureText(item).width;
    return result;
  }, {});

  console.log(numCharWidths);
  console.log(longestNumWidth);
  console.log(wordWidths);

  ctx.fillStyle = '#000';
  ctx.fillText(year, 20, 40);
  ctx.fillText(month, 20, 100);

  // TODO: Remove magic numbers, refactor into functions
  // TODO: Move giving below budget if it's greater
  // TODO: If too small draw label outside of box
  const maxWidth = 250;

  let smallerWidth;
  let givingGreater = false;
  if (givingNum > budgetNum) {
    givingGreater = true;
    smallerWidth = (budgetNum / givingNum) * maxWidth;
  } else {
    givingGreater = false;
    smallerWidth = (givingNum / budgetNum) * maxWidth;
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
    const width = 300;
    const height = 200;

    return (
      <Canvas
        style={{
          width,
          height,
        }}
        ref="chart"
        draw={(args) => {
          drawCanvas(args, this.props);
        }}
        width={width * 2}
        height={height * 2}
      />
    );
  }
}

export default GivingChart;
