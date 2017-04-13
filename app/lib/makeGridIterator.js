export default function makeGridIterator(
  width,
  height,
  colStart = 0,
  rowStart = 0
) {
  return function* iterGridPositions() {
    for (let row = rowStart; row < height; row++) {
      for (let col = colStart; col < width; col++) {
        const result = { row, col };
        yield result;
      }
    }
  };
}
