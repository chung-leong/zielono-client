const Babel = require('rollup-plugin-babel');
const Resolve = require('@rollup/plugin-node-resolve');

module.exports = [
  'index',
].map((name) => {
  return {
    input: `src/${name}.mjs`,
    output: {
      file: `./${name}.mjs`,
      format: 'esm'
    },
    plugins: [
      Babel({
        presets: [
          '@babel/env',
        ],
      }),
      Resolve(),
    ],
    external: [ 'react' ]
  };
});
