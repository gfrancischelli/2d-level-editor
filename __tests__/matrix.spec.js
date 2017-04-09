const test = require("tape");
const Matrix = require("../app/lib/Matrix").default;

test("matrix test", function(t) {
  const matrix = Matrix(2, 2, 1);
  t.deepLooseEqual(matrix, [[1, 1], [1, 1]]);
  t.notDeepLooseEqual(matrix, [[0, 0], [1, 1]]);
  t.end();
});
