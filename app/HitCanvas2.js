import Renderer from "./Renderer";
import { iter8bitColors } from "./lib/iterUniqueColors.js";
import intToHexString from "./lib/intToHexString";

const HitCanvas = {
  drawHitBox: function() {
    const gridPositions = this.gridIterator();
    this.cache.forEach((texture, textureName) => {
      const color = this.nextUniqueColor().value;
      let { col, row } = gridPositions.next().value;

      const hitWidth = texture.frame.w;
      const hitHeight = texture.frame.h;

      let x = col * (tileSize + margin) + margin;
      let y = row * (tileSize + margin) + margin;

      let currentColor = this.getPixelColor(x, y);

      while (currentColor !== this.backgroundColor) {
        const position = gridPositions.next().value;
        col = position.col;
        row = position.row;
        x = col * (tileSize + margin) + margin;
        y = row * (tileSize + margin) + margin;
        currentColor = this.getPixelColor(x, y);
      }

      this.hcx.fillStyle = color;
      this.hcx.fillRect(x, y, hitWidth, hitHeight);

      this.slotsMap.set(textureName, { col, row });
      this.hitMap.set(color, textureName);
    });
  },
  iterUniqueColor: iter8bitColors(),
  nextUniqueColor: function() {
    return this.iterUniqueColor.next();
  },
  getPixelColor: function(x, y) {
    const { data } = this.hcx.getImageData(x, y, 1, 1);
    return intToHexString(data[0], data[1], data[2]);
  }
};

export default HitCanvas;
