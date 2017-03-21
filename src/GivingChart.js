import React, {Component} from 'react';

const styles = {
  allPadding: {
    margin: '1rem 10px',
  },
};

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
  };
}

function calculateNumSpacing(ctx, giving, budget) {
  const numsChars = '$1234567890,.';
  const numCharWidths = numsChars.split('').reduce((result, item) => {
    result[item] = ctx.measureText(item).width;
    return result;
  }, {});

  const longestNumWidth = Object.keys(numCharWidths).reduce(
    (result, item) => {
      return result > numCharWidths[item] ? result : numCharWidths[item];
    },
    0,
  );

  const calculateStrWidths = (result, figure, index) => {
    let width;
    if (figure === '$' || figure === ',' || figure === '.') {
      width = numCharWidths[figure];
    } else {
      width = longestNumWidth;
    }

    let offset = 0;
    if (index !== 0) {
      let previousFigure = result[index - 1].figure;
      let previousOffset = result[index - 1].offset;

      offset += previousOffset;
      if (
        previousFigure === '$' ||
        previousFigure === ',' ||
        previousFigure === '.'
      ) {
        offset += numCharWidths[previousFigure];
      } else {
        offset += longestNumWidth;
      }
    }

    return result.concat({figure, offset, width});
  };

  const givingStr = `$${giving.toLocaleString()}`;
  const givingStrWidths = givingStr.split('').reduce(calculateStrWidths, []);
  const givingStrTotalWidth = givingStrWidths.reduce(
    (result, item) => {
      return result + item.width;
    },
    0,
  );

  const budgetStr = `$${budget.toLocaleString()}`;
  const budgetStrWidths = budgetStr.split('').reduce(calculateStrWidths, []);
  const budgetStrTotalWidth = budgetStrWidths.reduce(
    (result, item) => {
      return result + item.width;
    },
    0,
  );

  return {
    numCharWidths,
    longestNumWidth,
    givingStrWidths,
    budgetStrWidths,
    givingStrTotalWidth,
    budgetStrTotalWidth,
  };
}

function drawTabularFigures(
  {ctx, x, givingBoxTextY, budgetBoxTextY},
  giving,
  budget,
) {
  const {
    longestNumWidth,
    numCharWidths,
    givingStrWidths,
    budgetStrWidths,
    givingStrTotalWidth,
    budgetStrTotalWidth,
  } = calculateNumSpacing(ctx, giving, budget);

  ctx.fillStyle = '#000';

  const drawFigureWithSpacing = (item, xOffset, yOffset) => {
    let charOffset = 0;
    if (item.figure !== '$' && item.figure !== ',' && item.figure !== '.') {
      charOffset = (longestNumWidth - numCharWidths[item.figure]) / 2;
    }

    const totalOffset = xOffset + x + item.offset + charOffset;
    ctx.fillText(item.figure, totalOffset, yOffset);
  };

  // Draw Giving String //
  // Adjust xOffset to line up budget and giving lines
  givingStrWidths.forEach(item => {
    let xOffset;
    if (givingStrTotalWidth < budgetStrTotalWidth) {
      xOffset = budgetStrTotalWidth - givingStrTotalWidth;
    } else {
      xOffset = 0;
    }

    drawFigureWithSpacing(item, xOffset, givingBoxTextY);
  });

  // Draw Budget String //
  // Adjust xOffset to line up budget and giving lines
  budgetStrWidths.forEach(item => {
    let xOffset;
    if (budgetStrTotalWidth < givingStrTotalWidth) {
      xOffset = givingStrTotalWidth - budgetStrTotalWidth;
    } else {
      xOffset = 0;
    }

    drawFigureWithSpacing(item, xOffset, budgetBoxTextY);
  });
}

function drawBoxes({ctx, x, y, nextLineOffset}, giving, budget, maxBoxWidth) {
  const boxHeight = 90;

  const wordWidths = ['Giving', 'Budget'].reduce(
    (result, item) => {
      result[item] = ctx.measureText(item).width;
      return result;
    },
    {},
  );

  let budgetBoxWidth;
  let givingBoxWidth;
  let smallestItem;
  let smallestWidth;
  if (giving < budget) {
    givingBoxWidth = giving / budget * maxBoxWidth;
    budgetBoxWidth = maxBoxWidth;

    smallestItem = 'Giving';
    smallestWidth = givingBoxWidth;
  } else {
    givingBoxWidth = maxBoxWidth;
    budgetBoxWidth = budget / giving * maxBoxWidth;

    smallestItem = 'Budget';
    smallestWidth = budgetBoxWidth;
  }

  let textOffsetX = 30;

  let blackBudgetText = false;
  if (textOffsetX + wordWidths[smallestItem] + x / 2 >= smallestWidth) {
    textOffsetX += smallestWidth;
    if (smallestItem === 'Budget') {
      blackBudgetText = true;
    }
  }

  // Giving Box //
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  const textOffsetY = boxHeight * 0.7;
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
  if (budgetBoxWidth < 1) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, budgetBoxY, budgetBoxWidth, boxHeight);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, budgetBoxY, budgetBoxWidth, boxHeight);
  }

  // Text for Box
  ctx.fillStyle = blackBudgetText ? '#000' : '#FFF';
  ctx.fillText('Budget', textOffsetX, budgetBoxTextY);

  const boxEndSpacing = x * 2.25;
  return {
    boxsEndX: maxBoxWidth + boxEndSpacing,
    givingBoxTextY,
    budgetBoxTextY,
  };
}

function drawCanvas({ctx}, props, maxBoxWidth, graphMargins, font) {
  const {width, height} = ctx.canvas;
  const {year, month, giving, budget} = props;

  ctx.clearRect(0, 0, width, height);

  const fontSize = font.size;
  const elementSpacing = 12;

  ctx.font = `${fontSize}px ${font.family}`;

  const titleFinish = drawTitle(
    {
      ctx,
      x: graphMargins,
      y: fontSize,
      nextLineOffset: fontSize + 3,
      fontSize,
    },
    year,
    month,
  );

  const boxesFinish = drawBoxes(
    {
      ctx,
      x: graphMargins,
      y: titleFinish.y + elementSpacing * 3,
      nextLineOffset: elementSpacing,
    },
    giving,
    budget,
    maxBoxWidth,
  );

  drawTabularFigures(
    {
      ctx,
      x: boxesFinish.boxsEndX,
      givingBoxTextY: boxesFinish.givingBoxTextY,
      budgetBoxTextY: boxesFinish.budgetBoxTextY,
    },
    giving,
    budget,
  );
}

function expectedGraphWidth(props, maxBoxWidth, graphMargins, font, scale) {
  const {
    year,
    month,
    giving,
    budget,
  } = props;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${font.size}px ${font.family}`;

  const boxEndSpacing = graphMargins * 2.5;
  const boxWidth = graphMargins + maxBoxWidth + boxEndSpacing;

  const {
    givingStrTotalWidth,
    budgetStrTotalWidth,
  } = calculateNumSpacing(ctx, giving, budget);

  const letterWidth = Math.max(givingStrTotalWidth, budgetStrTotalWidth);

  const title = `Fiscal YTD - ${month} ${year}`;
  const titleWidth = ctx.measureText(title).width + graphMargins * 2;

  return Math.max(boxWidth + letterWidth, titleWidth) /
    (scale != null ? scale : 1);
}

class GivingChart extends Component {
  font = {
    size: 48,
    family: 'Quattrocento Sans',
  };
  maxBoxWidth = 380;
  graphMargins = 20;
  height = 173;

  getImageData() {
    const canvas = this.refs.canvas;
    return canvas.toDataURL('image/png');
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const {
      props,
      maxBoxWidth,
      graphMargins,
      font,
    } = this;

    const ctx = this.refs.canvas.getContext('2d');
    drawCanvas({ctx}, props, maxBoxWidth, graphMargins, font);
  }

  render() {
    const {
      props,
      maxBoxWidth,
      graphMargins,
      font,
      height,
    } = this;

    const scale = 2;
    const ppi = 300;

    const width = expectedGraphWidth(
      props,
      maxBoxWidth,
      graphMargins,
      font,
      scale,
    );

    // parseFloat to drop the extra 0's
    const widthPrint = parseFloat((width * scale / ppi).toFixed(2));
    const heightPrint = parseFloat((height * scale / ppi).toFixed(2));

    return (
      <div>
        <canvas
          ref="canvas"
          style={{
            width,
            height,
          }}
          width={width * scale}
          height={height * scale}
        />
        <p style={styles.allPadding}>
          {
            `Note: Chart is meant to be ${widthPrint}″ wide by ${heightPrint}″ high in print`
          }
        </p>
      </div>
    );
  }
}

export default GivingChart;
