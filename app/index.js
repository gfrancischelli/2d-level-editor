import assetLoader from "./assetLoader";
import assets from "../assets/game.assets";
import MenuFactory from "./Menu";
import HitCanvas2 from "./HitCanvas2";

import Matrix from "./lib/Matrix";
import makeGridIterator from "./lib/makeGridIterator";
import intToHexString from "./lib/intToHexString";
import { iter8bitColors } from "./lib/iterUniqueColors";

import HitCanvas from "./HitCanvas";
import renderer from "./Renderer";

import Settings from "./Settings";

async function start() {
  const cache = await assetLoader(assets);
  const config = await Settings.load();
  const { width, height, tileSize, worldMap } = config;

  const textureNames = Array.from(cache.keys());
  const iterUniqueColors = iter8bitColors(10);

  const WORLD = {
    width: width * tileSize,
    height: height * tileSize
  };

  const MENU_MARGIN_ITEMS = 5;
  const MENU_MARGIN = 5;
  const MENU_ITEMS_HORIZONTAL = 10;
  const MENU_ITEMS_VERTICAL = Math.ceil(
    textureNames.length / MENU_ITEMS_HORIZONTAL
  );

  const MENU = {
    width: (tileSize + MENU_MARGIN_ITEMS) * MENU_ITEMS_HORIZONTAL +
      MENU_MARGIN_ITEMS,
    height: WORLD.height + MENU_MARGIN_ITEMS,
    rows: 10
  };

  const APP = {
    width: WORLD.width + MENU.width,
    height: WORLD.height
  };

  // Init Renderer
  renderer.init({
    width: APP.width,
    height: APP.height,
    tileSize: tileSize,
    cache: cache,
    canvas: document.getElementById("root")
  });

  const Menu2 = MenuFactory.create({
    width: MENU.width,
    height: MENU.height,
    tileSize: tileSize,
    rows: 10,
    margin: 5
  });

  Menu2.init(cache);

  const hitCanvas = new HitCanvas(
    APP.width,
    APP.height,
    tileSize,
    document.getElementById("hitCanvas")
  );

  const canvas = makeCanvas("root");
  const cx = canvas.getContext("2d");
  cx.fillStyle = "rgb(250, 240, 250)";
  cx.fillRect(MENU.width, 0, WORLD.width, WORLD.height);

  const iterWorldGrid = makeGridIterator(
    WORLD.width / tileSize,
    WORLD.height / tileSize
  );

  const Store = {
    canvas: canvas,
    world: worldMap || Matrix(width, height, 0),
    mouse: {
      x: 0,
      y: 0
    },
    download_link: document.createElement("a"),
    init() {
      hitCanvas.drawWorldGrid({
        iterGrid: iterWorldGrid,
        offset: { x: MENU.width, y: 0 }
      });
    },
    getTileUnderCursor() {
      const { x, y } = this.mouse;
      const color = hitCanvas.getPixelColor(x, y);
      const tilePosition = hitCanvas.get(color);
      return tilePosition;
    },
    setTile(position, tile) {
      if (!!tile) {
        const sprite = cache.get(tile),
          width = sprite.frame.w / tileSize,
          height = sprite.frame.h / tileSize,
          flags = sprite.flags;

        const { col, row } = position;
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            this.world[row + h][col + w] = {tile, flags, entry: false};
          }
        }
        this.world[row][col] = {tile, flags, entry: true};
      }
    },
    setMouse(e) {
      const { x, y } = this.mouse;
      const canvas = this.canvas,
        offsetY = canvas.offsetTop,
        offsetX = canvas.offsetLeft;

      const mx = e.pageX - offsetX;
      const my = e.pageY - offsetY;

      this.mouse.x = mx;
      this.mouse.y = my;

      return { x: mx, y: my };
    },
    getMouseRegion() {
      const { x, y } = this.mouse;
      return x > MENU.width ? "world" : "menu";
    },
    exec(action) {
      this[action]();
    },
    FILL() {
      if (Store.selection === false) {
        return;
      }
      this.world.forEach((columns, row) => {
        columns.forEach((tile, col) => {
          if (tile === 0) {
            this.setTile({row, col}, Store.selection)
          }
        });
      });
    },
    stateHistory: [],
    CLEAR() {
      this.mapWorld(() => 0);
    },
    TOGGLE_GRID() {
      this.grid.active = !this.grid.active;
    },
    SAVE() {
      this.saved_map = this.world;
    },
    DOWNLOAD() {
      config.worldMap = this.world;
      const content = JSON.stringify(config);
      const blob = new Blob([content], { type: "text/json" });
      const a = this.download_link;
      a.href = window.URL.createObjectURL(blob);
      a.download = "worldmap.json";
      a.click();
    },
    EXPORT() {},
    mapWorld(fn) {
      this.stateHistory.push([...this.world]);
      this.world = this.world.map((columns, row) =>
        columns.map((tile, col) => {
          return fn(tile);
        }));
    },
    grid: {
      active: true,
      render() {
        if (this.active) {
          cx.globalAlpha = 0.05;
          drawGrid(cx, "rgba(4, 4, 4)");
          cx.globalAlpha = 1;
        }
      }
    },
    render() {
      cx.save();
      cx.translate(MENU.width, 0);
      this.world.forEach((columns, row) => {
        columns.forEach((tile, col) => {
          if (tile.entry && tile !== 0) {
            const x = col * tileSize;
            const y = row * tileSize;
            const sprite = cache.get(tile.tile);
            renderer.drawSprite(sprite, x, y);
          }
        });
      });
      cx.restore();
      this.grid.render();
    },
    draging: false,
    selection: false
  };

  Store.init();

  canvas.addEventListener("mousedown", e => {
    const { x, y } = Store.setMouse(e);
    const mouseRegion = Store.getMouseRegion();
    const color = Menu2.getPixelColor(x, y);
    if (mouseRegion === "menu") {
      if (color !== undefined) {
        const hit = Menu2.hitMap.get(color);
        if (hit.type === "tile") {
          Store.draging = true;
          Store.selection = hit.content;
        } else if (hit.type === "button") {
          Store.exec(hit.content.action);
        }
      }
    } else if (mouseRegion === "world") {
      const tilePosition = Store.getTileUnderCursor();
      Store.setTile(tilePosition, Store.selection);
      Store.draging = true;
    }
  });

  canvas.addEventListener("mouseup", e => {
    Store.draging = false;
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = Store.setMouse(e);
    const mouseRegion = Store.getMouseRegion();
    if (mouseRegion === "world" && Store.draging) {
      const tilePosition = Store.getTileUnderCursor();
      Store.setTile(tilePosition, Store.selection);
    }
  });

  function makeCanvas(id) {
    const canvas = document.getElementById(id);
    canvas.width = WORLD.width + MENU.width;
    canvas.height = WORLD.height;
    return canvas;
  }

  function drawGrid(cx, color = "#444444") {
    cx.save();
    cx.translate(MENU.width, 0);
    cx.strokeStyle = color;
    const worldPositions = iterWorldGrid();
    let done = false;
    while (done === false) {
      const nextPosition = worldPositions.next();
      done = nextPosition.done;
      if (done === true) break;
      const { row, col } = nextPosition.value;
      cx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
    cx.restore();
  }

  function render() {
    // Clear Screen
    cx.fillStyle = "#333333";
    cx.fillRect(0, 0, APP.width, APP.height);
    cx.fillStyle = "rgb(250, 240, 250)";
    cx.fillRect(MENU.width, 0, WORLD.width, WORLD.height);

    Store.render();
    Menu2.render(cx, cache, Store);


    requestAnimationFrame(render);
  }
  render();
}

start();
