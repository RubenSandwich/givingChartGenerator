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

function drawGraphs({ ctx, x, y, fontSize }, giving, budget, maxBoxWidth) {
  const barHeight = 40;
  const barSpacing = 5;

  const givingRatio = giving / budget;
  const shortfall = budget - giving;

  ctx.font = ctx.font.replace(/\d+px/, `${fontSize}px`);
  ctx.font = ctx.font.replace(/\d+Bold/, '');

  // Bar titles
  const givingX = x - 2;
  const givingTextY = y;

  ctx.fillStyle = '#000';
  ctx.fillText(`Giving $${giving.toLocaleString()}`, givingX, givingTextY);

  if (shortfall > 0) {
    const shortfallTextWidth = ctx.measureText('Shortfall').width;
    const shortfallX = x + maxBoxWidth - shortfallTextWidth;
    const shortfallY = y;

    ctx.fillStyle = '#000';
    ctx.fillText(
      `Shortfall $${shortfall.toLocaleString()}`,
      shortfallX,
      shortfallY,
    );
  }

  // Giving Bar
  const givingBarY = y + fontSize / 4 + barSpacing / 2;
  let givingBarWidth = giving / budget * maxBoxWidth;

  // Always show a little Giving Bar
  if (givingRatio < 0.01) {
    givingBarWidth = barSpacing;
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  if (shortfall > 0) {
    ctx.strokeRect(x, givingBarY, givingBarWidth, barHeight);
  } else {
    const overhang = 10;
    ctx.strokeRect(x, givingBarY, maxBoxWidth + overhang, barHeight);

    const overPlusTextfontSize = fontSize * 2;
    const overPlusTextX = x + maxBoxWidth + overhang + barSpacing;
    // Divided by 4 because font is 2x scaled
    const overPlusTextY = givingBarY + barHeight / 2 + overPlusTextfontSize / 4;

    // ctx.fontSize = fontSize;
    ctx.fillStyle = '#000';
    ctx.font = ctx.font.replace(/\d+px/, `${overPlusTextfontSize}px`);
    ctx.fillText('+', overPlusTextX, overPlusTextY);
  }

  // Shortfall Bar
  const shortfallBarX = x + barSpacing + givingBarWidth;
  const shortfallBarY = givingBarY;
  const shortfallBarWidth = maxBoxWidth - givingBarWidth - barSpacing;

  if (shortfall > 0) {
    ctx.fillStyle = '#000';
    ctx.fillRect(shortfallBarX, shortfallBarY, shortfallBarWidth, barHeight);
  }

  // Bottom Bar
  const bottomBarY = shortfallBarY + barHeight + barSpacing * 1.5;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 1, bottomBarY, maxBoxWidth + 1, barHeight);

  const budgetTextX = x + maxBoxWidth + barSpacing;
  // Divided by 4 because font is 2x scaled
  const budgetTextY = bottomBarY + barHeight / 2 + fontSize / 4 + 2;

  ctx.font = ctx.font.replace(/\d+px/, `${fontSize}px`);
  ctx.fillStyle = '#000';
  ctx.fillText(`Budget $${budget.toLocaleString()}`, budgetTextX, budgetTextY);

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
    ctx.clearRect(leftCutX, bottomBarY - 1, leftCutWidth, cutHeight + 1);

    ctx.fillStyle = '#FFF';
    ctx.clearRect(leftCutX, bottomCutY, leftCutWidth, cutHeight + 1);

    // 2. Shortfall Bar Cuts
    const rightCutX = leftCutX + leftCutWidth + graphTickWidth;
    const rightCutWidth =
      shortfallBarWidth - graphTickWidth + middleGraphTickSpacing;

    ctx.fillStyle = '#FFF';
    ctx.clearRect(rightCutX, bottomBarY - 1, rightCutWidth, cutHeight + 1);

    ctx.fillStyle = '#FFF';
    ctx.clearRect(rightCutX, bottomCutY, rightCutWidth, cutHeight + 1);
  } else {
    const cutWidth = maxBoxWidth - graphTickWidth * 2;
    ctx.fillStyle = '#FFF';
    ctx.clearRect(leftCutX, bottomBarY - 1, cutWidth, cutHeight + 1);

    ctx.fillStyle = '#FFF';
    ctx.clearRect(leftCutX, bottomCutY, cutWidth, cutHeight + 1);
  }
}

function drawCanvas({ ctx }, props, maxBoxWidth, graphMargins, font) {
  const { width, height } = ctx.canvas;
  const { year, month, giving, budget } = props;

  ctx.clearRect(0, 0, width, height);

  const fontSize = font.size;
  const elementSpacing = 40;

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

  const titleFontWidthOffset = 6;
  drawGraphs(
    {
      ctx,
      x: graphMargins + titleFontWidthOffset,
      y: titleFinish.y + elementSpacing,
      fontSize: fontSize / 2,
    },
    giving,
    budget,
    titleFinish.fiscalStringWidth - titleFontWidthOffset,
    titleFontWidthOffset,
  );
}

function expectedGraphWidth(props, maxBoxWidth, graphMargins, font, scale) {
  const { budget } = props;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.font = `${font.size / 2}px ${font.family}`;

  // Calculate the budget box line width
  const boxWidth = graphMargins + maxBoxWidth;

  const budgetStr = `budget $${budget.toLocaleString()}`;
  const budgetWidth = ctx.measureText(budgetStr).width;

  return (boxWidth + budgetWidth) / scale;
}

class GivingChart extends Component {
  font = {
    size: 48,
    family: 'Quattrocento Sans',
  };
  maxBoxWidth = 500;
  graphMargins = 20;
  height = 125;

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
          style={{ width, height }}
          width={width * scale}
          height={height * scale}
        />
        <p style={styles.allPadding}>
          {`Note: Chart is meant to be ${widthPrint}″ wide by ${heightPrint}″ high in print`}
        </p>
      </div>
    );
  }
}

export default GivingChart;
