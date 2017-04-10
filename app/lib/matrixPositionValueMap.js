function matrixPositionValueMap(matrix, iterator) {
  const hitMap = new Map();
  matrix.forEach((columns, row) => {
    columns.forEach((_, col) => {
      const key = iterator.next().value;
      const position = { row, col };
      hitMap.set(key, position);
    });
  });
  return hitMap;
}

export default matrixPositionValueMap;
