const { join: joinPath } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

function resolve(dir) {
  return joinPath(__dirname, dir);
}

module.exports = {
  publicPath: '/',
  configureWebpack: {
    entry: {
      app: './structure/modularized/src/main.ts',
    },
    resolve: {
      alias: {
        '@': resolve('./structure/modularized/src/shared'),
      },
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].template = resolve('./build/public/index.html');

      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers'),
        },
      },
    },
  },
  devServer: {
    disableHostCheck: true,
  },
};
