
import React, { Component } from 'react';
import Canvas from 'react-canvas-component';


function drawTabularFigures({ ctx, x, y, nextLineOffset }, giving, budget) {
  // Generate char widths needed to simulate tabular figures
  const numsChars = '$1234567890,.'
  const numCharWidths = numsChars.split('').reduce((result, item) => {
    result[item] =  ctx.measureText(item).width;
    return result;
  }, {});

  const longestNumWidth = Object.keys(numCharWidths).reduce((result, item) => {
    return result > numCharWidths[item] ? result : numCharWidths[item];
  }, 0);

  ctx.fillStyle = '#000';

  let xOffset = 0;
  const givingStr = `$${giving.toLocaleString()}`;
  const budgetStr = `$${budget.toLocaleString()}`;

  // Draw Giving String //
  // Adjust xOffset to line up budget and giving lines
  if (givingStr.length < budgetStr.length) {
    const diff = budgetStr.length - givingStr.length;
    xOffset = diff * longestNumWidth;
  } else {
    xOffset = 0;
  }
  givingStr.split('').forEach((figure) => {
    let charOffset = (longestNumWidth - numCharWidths[figure]) / 2;

    ctx.fillText(figure, x + xOffset + charOffset, y);
    xOffset += longestNumWidth;
  });

  // Draw Budget String //
  // Adjust xOffset to line up budget and giving lines
  if (givingStr.length > budgetStr.length) {
    const diff = givingStr.length - budgetStr.length;
    xOffset = diff * longestNumWidth;
  } else {
    xOffset = 0;
  }
  budgetStr.split('').forEach((figure) => {
    let charOffset = (longestNumWidth - numCharWidths[figure]) / 2;

    ctx.fillText(figure, x + xOffset + charOffset, y + nextLineOffset);
    xOffset += longestNumWidth;
  });
}

function drawBoxes({ ctx, x, y, nextLineOffset }, giving, budget) {
  const maxBoxWidth = 250;
  const boxHeight = 100;

  const wordWidths = ['Giving', 'Budget'].reduce((result, item) => {
    result[item] =  ctx.measureText(item).width;
    return result;
  }, {});

  let budgetBoxWith;
  let givingBoxWidth;
  let smallestItem;
  let smallestWidth;
  if (giving < budget) {
    givingBoxWidth = (giving / budget) * maxBoxWidth;
    budgetBoxWith = maxBoxWidth;

    smallestItem = 'Giving';
    smallestWidth = givingBoxWidth;
  } else {
    givingBoxWidth = maxBoxWidth;
    budgetBoxWith = (budget / giving) * maxBoxWidth;

    smallestItem = 'Budget';
    smallestWidth = budgetBoxWith;
  }

  let textOffset = 30;

  let blackBudgetText = false;
  if ((textOffset + wordWidths[smallestItem] + 10) >= smallestWidth) {
    textOffset += smallestWidth;
    if (smallestItem === 'Budget') {
      blackBudgetText = true;
    }
  }

  // Giving Box //
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, givingBoxWidth, boxHeight);
  // Text for Box
  ctx.fillStyle = '#000';
  ctx.fillText('Giving', textOffset, y + (boxHeight / 2));

  // Budget Box //
  const budgetBoxY = y + boxHeight + nextLineOffset;
  ctx.fillStyle = '#000';
  ctx.fillRect(x, budgetBoxY, budgetBoxWith, boxHeight);
  // Text for Box
  ctx.fillStyle =  blackBudgetText ? '#000' : '#FFF';
  ctx.fillText('Budget', textOffset, budgetBoxY + (boxHeight / 2));
}

function drawCanvas({ ctx, time }, props) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;

  ctx.clearRect(0, 0, width, height);

  // Titles //
  ctx.font = '24px Quattrocento Sans';

  ctx.fillStyle = '#000';
  ctx.fillText(year, 20, 40);
  ctx.fillText(month, 20, 100);

  drawBoxes({ctx, x: 20, y: 150, nextLineOffset: 20}, giving, budget)
  drawTabularFigures({ctx, x: 280, y: 200, nextLineOffset: 90}, giving, budget);
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
          width: width,
          height: height,
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
