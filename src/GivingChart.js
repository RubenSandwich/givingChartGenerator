import React, { Component } from 'react';

const styles = {
  allPadding: {
    margin: '1rem 10px',
  },
};

function drawTitle({ ctx, x, y, nextLineOffset, fontSize }, year, month) {
  ctx.fillStyle = '#000';
  const previousFont = ctx.font.replace(/"/g, '');

  ctx.font = `${previousFont} Bold`;
  ctx.fillText('Financial Update', x, y);

  ctx.font = previousFont;
  const fiscalString = `Fiscal YTD - ${month} ${year}`;
  const fiscalStringWidth = ctx.measureText(fiscalString).width;
  ctx.fillText(fiscalString, x, y + nextLineOffset);

  return {
    x,
    y: y + nextLineOffset,
    fiscalStringWidth,
  };
}

function calculateNumSpacing(ctx, giving, budget) {
  const numsChars = '$1234567890,.';
  const numCharWidths = numsChars.split('').reduce((result, item) => {
    result[item] = ctx.measureText(item).width;
    return result;
  }, {});

  const longestNumWidth = Object.keys(numCharWidths).reduce((result, item) => {
    return result > numCharWidths[item] ? result : numCharWidths[item];
  }, 0);

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

    return result.concat({
      figure,
      offset,
      width,
    });
  };

  const givingStr = `$${giving.toLocaleString()}`;
  const givingStrWidths = givingStr.split('').reduce(calculateStrWidths, []);
  const givingStrTotalWidth = givingStrWidths.reduce((result, item) => {
    return result + item.width;
  }, 0);

  const budgetStr = `$${budget.toLocaleString()}`;
  const budgetStrWidths = budgetStr.split('').reduce(calculateStrWidths, []);
  const budgetStrTotalWidth = budgetStrWidths.reduce((result, item) => {
    return result + item.width;
  }, 0);

  return {
    numCharWidths,
    longestNumWidth,
    givingStrWidths,
    budgetStrWidths,
    givingStrTotalWidth,
    budgetStrTotalWidth,
  };
}

// function drawTabularFigures(
//   { ctx, x, givingBoxTextY, budgetBoxTextY },
//   giving,
//   budget,
// ) {
//   const {
//     longestNumWidth,
//     numCharWidths,
//     givingStrWidths,
//     budgetStrWidths,
//     givingStrTotalWidth,
//     budgetStrTotalWidth,
//   } = calculateNumSpacing(ctx, giving, budget);

//   ctx.fillStyle = '#000';

//   const drawFigureWithSpacing = (item, xOffset, yOffset) => {
//     let charOffset = 0;
//     if (item.figure !== '$' && item.figure !== ',' && item.figure !== '.') {
//       charOffset = (longestNumWidth - numCharWidths[item.figure]) / 2;
//     }

//     const totalOffset = xOffset + x + item.offset + charOffset;
//     ctx.fillText(item.figure, totalOffset, yOffset);
//   };

//   // Draw Giving String //
//   // Adjust xOffset to line up budget and giving lines
//   givingStrWidths.forEach(item => {
//     let xOffset;
//     if (givingStrTotalWidth < budgetStrTotalWidth) {
//       xOffset = budgetStrTotalWidth - givingStrTotalWidth;
//     } else {
//       xOffset = 0;
//     }

//     drawFigureWithSpacing(item, xOffset, givingBoxTextY);
//   });

//   // Draw Budget String //
//   // Adjust xOffset to line up budget and giving lines
//   budgetStrWidths.forEach(item => {
//     let xOffset;
//     if (budgetStrTotalWidth < givingStrTotalWidth) {
//       xOffset = givingStrTotalWidth - budgetStrTotalWidth;
//     } else {
//       xOffset = 0;
//     }

//     drawFigureWithSpacing(item, xOffset, budgetBoxTextY);
//   });
// }

function drawGraphs(
  { ctx, x, y, nextLineOffset, fontSize },
  giving,
  budget,
  maxBoxWidth,
) {
  const barHeight = 40;
  const barSpacing = 5;

  const givingRatio = giving / budget;
  const shortfall = budget - giving;

  // Giving Bar
  let givingBarWidth = giving / budget * maxBoxWidth;

  // Always show a little Giving Bar
  if (givingRatio < 0.01) {
    givingBarWidth = barSpacing;
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  if (shortfall > 0) {
    ctx.strokeRect(x, y, givingBarWidth, barHeight);
  } else {
    const overhang = 10;
    ctx.strokeRect(x, y, maxBoxWidth + overhang, barHeight);

    const overPlusTextX = x + maxBoxWidth + overhang + barSpacing;
    // Divided by 4 because font is 2x scaled
    const overPlusTextY = y + barHeight / 2 + fontSize / 4;

    ctx.fontSize = fontSize;
    ctx.fillStyle = '#000';
    ctx.fillText('+', overPlusTextX, overPlusTextY);
  }

  // Shortfall Bar
  const shortfallBarX = x + barSpacing + givingBarWidth;
  const shortfallBarWidth = maxBoxWidth - givingBarWidth - barSpacing;

  if (shortfall > 0) {
    ctx.fillStyle = '#000';
    ctx.fillRect(shortfallBarX, y, shortfallBarWidth, barHeight);
  }

  // Bottom Bar
  const bottomBarY = y + barHeight + barSpacing;
  ctx.fillStyle = '#000';
  ctx.fillRect(x, bottomBarY, maxBoxWidth, barHeight);

  const graphTickWidth = 3;
  const cutHeight = barHeight / 2 - barSpacing / 2;
  const bottomCutY = bottomBarY + barHeight - cutHeight;
  const leftCutX = x + graphTickWidth;

  // Draw cuts in bottom bar
  if (shortfall > 0) {
    const middleGraphTickSpacing = (barSpacing - graphTickWidth) / 2;

    // 1. Giving Bar Cuts
    const leftCutWidth =
      givingBarWidth - graphTickWidth + middleGraphTickSpacing;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(leftCutX, bottomBarY, leftCutWidth, cutHeight);

    ctx.fillStyle = '#FFF';
    ctx.fillRect(leftCutX, bottomCutY, leftCutWidth, cutHeight);

    // 2. Shortfall Bar Cuts
    const rightCutX = leftCutX + leftCutWidth + graphTickWidth;
    const rightCutWidth =
      shortfallBarWidth - graphTickWidth + middleGraphTickSpacing;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(rightCutX, bottomBarY, rightCutWidth, cutHeight);

    ctx.fillStyle = '#FFF';
    ctx.fillRect(rightCutX, bottomCutY, rightCutWidth, cutHeight);
  } else {
    const cutWidth = maxBoxWidth - graphTickWidth * 2;
    ctx.fillStyle = '#FFF';
    ctx.fillRect(leftCutX, bottomBarY, cutWidth, cutHeight);

    ctx.fillStyle = '#FFF';
    ctx.fillRect(leftCutX, bottomCutY, cutWidth, cutHeight);
  }
}

function drawCanvas({ ctx }, props, maxBoxWidth, graphMargins, font) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;

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

  drawGraphs(
    {
      ctx,
      x: graphMargins,
      y: titleFinish.y + elementSpacing * 3,
      fontSize,
    },
    giving,
    budget,
    titleFinish.fiscalStringWidth,
  );
}

function expectedGraphWidth(props, maxBoxWidth, graphMargins, font, scale) {
  const { year, month, giving, budget } = props;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${font.size}px ${font.family}`;

  const boxEndSpacing = graphMargins * 2.5;
  const boxWidth = graphMargins + maxBoxWidth + boxEndSpacing;

  const { givingStrTotalWidth, budgetStrTotalWidth } = calculateNumSpacing(
    ctx,
    giving,
    budget,
  );

  const letterWidth = Math.max(givingStrTotalWidth, budgetStrTotalWidth);

  const title = `Fiscal YTD - ${month} ${year}`;
  const titleWidth = ctx.measureText(title).width + graphMargins * 2;

  return (
    Math.max(boxWidth + letterWidth, titleWidth) / (scale != null ? scale : 1)
  );
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
    const { props, maxBoxWidth, graphMargins, font } = this;

    const ctx = this.refs.canvas.getContext('2d');
    drawCanvas(
      {
        ctx,
      },
      props,
      maxBoxWidth,
      graphMargins,
      font,
    );
  }

  render() {
    const { props, maxBoxWidth, graphMargins, font, height } = this;

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
        <br />
        <p style={styles.allPadding}>
          {`Note: Chart is meant to be ${widthPrint}″ wide by ${heightPrint}″ high in print`}
        </p>
        <br />
      </div>
    );
  }
}

export default GivingChart;
