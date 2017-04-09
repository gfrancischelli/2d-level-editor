function Matrix(m, n, value = 0) {
  const matrix = [];
  const worldHitMap = {};
  for (let r = 0; r < n; r++) {
    let row = [];
    for (let c = 0; c < m; c++) {
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
};

export default Matrix;