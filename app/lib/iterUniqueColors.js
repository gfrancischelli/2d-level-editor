import intToHexString from "./intToHexString";

function IterUniqueColors(step = 1, range = 256) {
  return function* iterUniqueColors() {
    let r = 0, g = 0, b = 0;

    while (r < range) {
      while (g < range) {
        while (b < range) {
          const color = intToHexString(r, g, b);
          yield color;
          b += step;
        }
        b = 0;
        g += step;
      }
      g = 0;
      r += step;
    }
  };
}

export const iter8bitColors = IterUniqueColors(15, 256);
export default IterUniqueColors;
