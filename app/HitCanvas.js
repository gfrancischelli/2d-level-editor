import { iter8bitColors } from "./lib/iterUniqueColors.js";
import intToHexString from "./lib/intToHexString";

function HitCanvas(width, height, tileSize, canvas) {
  this.canvas = canvas;
  canvas.width = width;
  canvas.height = height;
  this.tileSize = tileSize;
  this.cx = this.canvas.getContext("2d");
  this.backgroundColor = "#ff00ff";
  this.cx.fillStyle = this.backgroundColor;
  this.cx.fillRect(0, 0, width, height);
  this.hitMap = new Map();
  this.menuHitMap = new Map();
}

HitCanvas.prototype.iterUniqueColors = iter8bitColors();
  
HitCanvas.prototype.get = function(color) {
  return this.hitMap.get(color);
};

HitCanvas.prototype.getPixelColor = function(x, y) {
  const { data } = this.cx.getImageData(x, y, 1, 1);
  return intToHexString(data[0], data[1], data[2]);
};

HitCanvas.prototype.getMenu = function(color) {
  return this.menuHitMap.get(color);
}

HitCanvas.prototype.drawWorldGrid = function(
  {
    iterGrid,
    offset = { x: 0, y: 0 }
  }
) {
  const { hitMap, tileSize, cx, iterUniqueColors } = this;
  const gridIterator = iterGrid();

  cx.save();
  cx.translate(offset.x, offset.y);

  while (true) {
    // Iter over next grid position
    // Break loop if the iterator is done
    const { done, value } = gridIterator.next();
    if (done === true) break;

    // Get a unique color and grid's rows and columns
    const color = iterUniqueColors.next().value;
    const { row, col } = value;

    const x = col * tileSize;
    const y = row * tileSize;

    cx.fillStyle = color;
    cx.fillRect(x, y, tileSize, tileSize);

    hitMap.set(color, value);
  }

  cx.restore();
};

HitCanvas.prototype.drawMenuGrid = function(
  { iterGrid, margin = 0, textures }
) {
  const { cx, menuHitMap, iterUniqueColors, tileSize } = this;
  const gridIterator = iterGrid();

  cx.save();
  textures.forEach((texture, textureName) => {
    const color = iterUniqueColors.next().value;
    const { col, row } = gridIterator.next().value;

    const hitWidth = texture.frame.w;
    const hitHeight = texture.frame.h;

    let x = col * tileSize + margin + margin * col;
    let y = row * tileSize + margin + margin * row;

    let currentColor = this.getPixelColor(x, y);


    while(currentColor !== this.backgroundColor) {
      const { col, row } = gridIterator.next().value;
      x = col * tileSize + margin + margin * col;
      y = row * tileSize + margin + margin * row;
      currentColor = this.getPixelColor(x, y);
    }

    cx.fillStyle = color;
    cx.fillRect(x, y, hitWidth, hitHeight);

    menuHitMap.set(color, textureName);
  });

  cx.restore();
};

export default HitCanvas;
