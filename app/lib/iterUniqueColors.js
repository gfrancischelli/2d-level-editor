function IterUniqueColors(range = 256) {
  return function* iterUniqueColors() {
    let r = 0, g = 0, b = 0;

    while (r < range) {
      while (g < range) {
        while (b < range) {
          yield new Uint8ClampedArray([r, g, b]);
          b++;
        }
        b = 0;
        g++;
      }
      g = 0;
      r++;
    }
  };
}

export const iter8bitColors = IterUniqueColors(256);
export {IterUniqueColors};
