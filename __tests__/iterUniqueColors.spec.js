var test = require("tape");
var IterUniqueColors = require("../app/lib/iterUniqueColors").default;

test("Iterate over unique colors", function(t) {
  var iterator = IterUniqueColors(3)();
  var done = false;
  var count = 0;
  while (done === false) {
    var result = iterator.next();
    done = result.done;
    if (result.value !== undefined) count++;
  }
  t.equal(count, 27);
  t.end();
});
