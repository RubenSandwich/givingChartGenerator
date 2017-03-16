
import React, { Component } from 'react';


function drawTabularFigures({ ctx, x, givingBoxTextY, budgetBoxTextY }, giving, budget) {
  // Generate char widths needed to simulate tabular figures
  const numsChars = '$1234567890,.'
  const numCharWidths = numsChars.split('').reduce((result, item) => {
    result[item] =  ctx.measureText(item).width;
    return result;
  }, {});

  const longestNumWidth = Object.keys(numCharWidths).reduce((result, item) => {
    return result > numCharWidths[item] ? result : numCharWidths[item];
  }, 0) - 4; // NOTE: FIX THIS!

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

    ctx.fillText(figure, x + xOffset + charOffset, givingBoxTextY);
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

    ctx.fillText(figure, x + xOffset + charOffset, budgetBoxTextY);
    xOffset += longestNumWidth;
  });
}

function drawBoxes({ ctx, x, y, nextLineOffset }, giving, budget) {
  const maxBoxWidth = 380;
  const boxHeight = 90;

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

  let textOffsetX = 30;
  let padding = 10;

  let blackBudgetText = false;
  if ((textOffsetX + wordWidths[smallestItem] + padding) >= smallestWidth) {
    textOffsetX += smallestWidth;
    if (smallestItem === 'Budget') {
      blackBudgetText = true;
    }
  }

  // Giving Box //
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  const textOffsetY = (boxHeight * 0.7);
  const givingBoxTextY = y + textOffsetY;
  ctx.strokeRect(x, y, givingBoxWidth, boxHeight);
  // Text for Box
  ctx.fillStyle = '#000';
  ctx.fillText('Giving', textOffsetX, givingBoxTextY);

  // Budget Box //
  const budgetBoxY = y + boxHeight + nextLineOffset;
  const budgetBoxTextY = budgetBoxY + textOffsetY;

  // Stroke if a small line as stroke always draws
  // something while fill does not
  if (budgetBoxWith < 1) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, budgetBoxY, budgetBoxWith, boxHeight);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, budgetBoxY, budgetBoxWith, boxHeight);
  }

  // Text for Box
  ctx.fillStyle =  blackBudgetText ? '#000' : '#FFF';
  ctx.fillText('Budget', textOffsetX, budgetBoxTextY);

  return {
    boxsEndX: maxBoxWidth + 45,
    givingBoxTextY,
    budgetBoxTextY,
  }
}

function drawTitle({ctx, x, y, nextLineOffset, fontSize}, year, month) {
  ctx.fillStyle = '#000';
  const previousFont = ctx.font.replace(/"/g, '');

  ctx.font = `${previousFont} Bold`;
  ctx.fillText('Financial Update', x, y);

  ctx.font = previousFont;
  ctx.fillText(`Fiscal YTD - ${month} ${year}`, x, y + nextLineOffset);

  return {
    x,
    y: y + nextLineOffset,
  }
}

function drawCanvas({ ctx }, props) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;

  ctx.clearRect(0, 0, width, height);

  // Debug Margins
  // ctx.fillStyle = '#F44';
  // ctx.fillRect(0, 0, width, 20);
  //
  // ctx.fillStyle = '#F44';
  // ctx.fillRect(0, 0, 20, height);
  //
  // ctx.fillStyle = '#F44';
  // ctx.fillRect(0, height - 20, width, 20);
  //
  // ctx.fillStyle = '#F44';
  // ctx.fillRect(width - 20, 0, 20, height);
  // End Debug Margins

  const fontSize = 48;
  const margin = 20;
  const elementSpacing = 12;

  ctx.font = `${fontSize}px Quattrocento Sans`;

  const titleFinish = drawTitle({
    ctx,
    x: margin,
    y: fontSize,
    nextLineOffset: fontSize + 3,
    fontSize,
  }, year, month);

  const boxesFinish = drawBoxes({
    ctx,
    x: titleFinish.x,
    y: titleFinish.y + elementSpacing * 3,
    nextLineOffset: elementSpacing,
  }, giving, budget);

  drawTabularFigures({
    ctx,
    x: boxesFinish.boxsEndX,
    givingBoxTextY: boxesFinish.givingBoxTextY,
    budgetBoxTextY: boxesFinish.budgetBoxTextY,
  }, giving, budget);
}

class GivingChart extends Component {
  width = 330;
  height = 173;

  getImageData() {
    const canvas = this.refs.canvas;
    return canvas.toDataURL("image/png");
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    drawCanvas({ ctx }, this.props)
  }

  render() {
    return (
      <canvas
        ref="canvas"
        style={{
          width: this.width,
          height: this.height,
        }}
        width={this.width * 2}
        height={this.height * 2}
      />
    );
  }
}

export default GivingChart;
