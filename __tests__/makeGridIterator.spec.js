const test = require("tape");
const makeGridIterator = require("../app/lib/makeGridIterator").default;

test("make grid iterator", (t) => {
  const generator = makeGridIterator(2, 2)();
  t.looseEqual({row: 0, col: 0}, generator.next().value);
  t.looseEqual({row: 0, col: 1}, generator.next().value);
  t.looseEqual({row: 1, col: 0}, generator.next().value);
  t.looseEqual({row: 1, col: 1}, generator.next().value);
  t.equal(true, generator.next().done)
  t.end()
})
