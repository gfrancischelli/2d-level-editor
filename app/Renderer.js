const Renderer = {
  init: function({ width, height, cache, tileSize, canvas }) {
    this.cache = cache;
    this.canvas = canvas;
    this.cx = canvas.getContext("2d");
    this.fontSize = 10;
  },
  drawRect: function(color, ...args) {
    const { cx } = this;
    cx.save();
    cx.fillStyle = color;
    cx.fillRect(...args);
    cx.restore();
  },
  renderText: function(text, ...args) {
    const { cx } = this;
    cx.save();
    cx.textAlign = "center";
    cx.fillStyle = "#000000";
    cx.fillText(text, ...args);
    cx.restore();
  },
  renderButtonText(button, x, y) {
    this.renderText(
      button.name,
      x + button.w / 2,
      y + button.h / 1.5,
      button.w
    );
  },
  drawSprite: function({ texture, frame }, x, y) {
    this.cx.drawImage(
      texture,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      x,
      y,
      frame.w,
      frame.h
    );
  }
};

export default Renderer;
