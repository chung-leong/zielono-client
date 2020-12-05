const requireTest = require.context('./test', true, /\.test\.js$/);
const files = requireTest.keys();
// run each of them
for (let file of files) {
  requireTest(file);
}
