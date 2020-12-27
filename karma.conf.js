module.exports = (config) => {
  config.set({
    port: 9876,
    logLevel: config.LOG_WARNING,
    autoWatch: true,
    singleRun: false,
    browsers: [ 'Chrome' ],
    frameworks: [ 'chai', 'mocha', 'server-side' ],
    files: [
      'tests.bundle.js',
    ],
    client: {
      args: parseTestPattern(process.argv),
    },
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-server-side',
      'karma-spec-reporter',
    ],
    reporters: [ 'spec' ],
    specReporter: {
      maxLogLines: 5,
      suppressErrorSummary: true,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: false,
      failFast: false,
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|mjs)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: [
                '@babel/env',
                '@babel/react',
              ],
              plugins: [
                '@babel/transform-runtime',
              ],
            }
          },
        ]
      },
    },

    webpackMiddleware: {
      noInfo: true,
    },
  })
};

function parseTestPattern(argv) {
  const index = argv.indexOf('--');
  const patterns = (index !== -1) ? argv.slice(index + 1) : [];
  return (patterns.length > 0) ? [ '--grep', ...patterns ] : [];
}
