import HitCanvas from "./HitCanvas2";
import Renderer from "./Renderer";
import makeGridIterator from "./lib/makeGridIterator";

function MenuFactory(
  { width, height, x = 0, y = 0, margin = 0, tileSize, rows }
) {
  const backgroundColor = "#ff00ff";
  const hitCanvas = document.createElement("canvas");
  hitCanvas.width = width;
  hitCanvas.height = height;
  const hcx = hitCanvas.getContext("2d");
  hcx.translate(x, y);
  hcx.fillStyle = "#ff00ff";
  hcx.fillRect(0, 0, width, height);

  const hitMap = new Map();

  // Only development
  document.body.appendChild(hitCanvas);

  const iterGrid = makeGridIterator(rows, 20);
  const gridPositions = iterGrid();

  function initSprite(texture, textureName) {
    const color = this.nextUniqueColor().value;
    let { col, row } = gridPositions.next().value;

    const hitWidth = texture.frame.w;
    const hitHeight = texture.frame.h;

    let x = col * tileSize + margin + margin * col;
    let y = row * tileSize + margin + margin * row;

    let currentColor = this.getPixelColor(x, y);

    while (
      currentColor !== this.backgroundColor || x + hitWidth > hitCanvas.width
    ) {
      const position = gridPositions.next().value;
      col = position.col;
      row = position.row;
      x = col * (tileSize + margin) + margin;
      y = row * (tileSize + margin) + margin;
      currentColor = this.getPixelColor(x, y);
    }

    this.hcx.fillStyle = color;
    this.hcx.fillRect(x, y, hitWidth, hitHeight);

    const result = { type: "tile", content: textureName };
    this.slotsMap.set(result, { col, row });
    this.hitMap.set(color, result);
  }

  function initButton(button) {
    const color = this.nextUniqueColor().value;
    let { col, row } = gridPositions.next().value;
    button.w *= tileSize;
    button.h *= tileSize;
    const hitHeight = button.h * tileSize;
    let x = col * tileSize + margin + margin * col;
    let y = row * tileSize + margin + margin * row;
    let currentColor = this.getPixelColor(x, y);
    while (
      currentColor !== this.backgroundColor || x + button.w > hitCanvas.width
    ) {
      const position = gridPositions.next().value;
      col = position.col;
      row = position.row;
      x = col * (tileSize + margin) + margin;
      y = row * (tileSize + margin) + margin;
      currentColor = this.getPixelColor(x, y);
    }
    this.hcx.fillStyle = color;
    this.hcx.fillRect(x, y, button.w, button.h);

    const result = { type: "button", content: button };
    this.slotsMap.set(result, { col, row });
    this.hitMap.set(color, result);
  }

  return Object.assign({}, HitCanvas, Renderer, {
    hcx,
    hitCanvas,
    backgroundColor,
    hitMap: new Map(),
    slotsMap: new Map(),
    buttons: [
      { action: "FILL", w: 2, h: 1, name: "Fill" },
      { action: "TOGGLE_GRID", w: 2, h: 1, name: "Grid" },
      { action: "CLEAR", w: 2, h: 1, name: "Clear" },
      { action: "DOWNLOAD", w: 2, h: 1, name: "Download" }
    ],
    init: function(cache) {
      cache.forEach(initSprite.bind(this));
      // Skip 2 rows. I know, that's horrible but cmon
      // deadline2short babyyy
      this.buttons.forEach(initButton.bind(this));
    },
    render: function(cx, cache, Store) {
      const gridPositions = iterGrid();

      for (let [key, { col, row }] of this.slotsMap) {
        const x = col * tileSize + margin + margin * col;
        const y = row * tileSize + margin + margin * row;

        if (key.type === "tile") {
          const sprite = cache.get(key.content);
          cx.save();
          cx.fillStyle = "#FA00DA";
          // Draw selected tile Border
          if (key.content === Store.selection) {
            cx.fillRect(x - 3, y - 3, sprite.frame.w + 6, sprite.frame.h + 6);
          }
          this.drawSprite(sprite, x, y, cx);
          cx.restore();
        } else if (key.type === "button") {
          const button = key.content;
          this.drawRect("#DDFF99", x, y, button.w, button.h);
          this.renderButtonText(button, x, y);
        }
      }
    }
  });
}

MenuFactory.create = function(args) {
  return MenuFactory(args);
};

export default MenuFactory;
