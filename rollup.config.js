import Babel from 'rollup-plugin-babel';
import Resolve from '@rollup/plugin-node-resolve';

export default [ 'index' ].map((name) => {
  return {
    input: `src/${name}.mjs`,
    output: {
      file: `./${name}.js`,
      format: 'umd',
      name: 'ZielonoClient',
      exports: 'named',
      globals: {
        react: 'React',
      }
    },
    plugins: [
      Babel({
        presets: [
          '@babel/env',
        ],
        plugins: [
          [ '@babel/plugin-proposal-class-properties', { loose: true } ],
          [ '@babel/plugin-proposal-private-methods', { loose: true } ],
        ]
      }),
      Resolve(),
    ],
    external: [ 'react' ]
  };
});
