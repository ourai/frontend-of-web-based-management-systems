const { join: joinPath, resolve: resolvePath } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires
const mock = require('mocker-api'); // eslint-disable-line @typescript-eslint/no-var-requires

function resolve(dir) {
  return joinPath(__dirname, dir);
}

const APP_SRC = './app/structure/modularized/src';

module.exports = {
  publicPath: '/',
  configureWebpack: {
    entry: {
      app: `${APP_SRC}/main.ts`,
    },
    resolve: {
      alias: {
        '@': resolve(`${APP_SRC}/shared`),
        '@petals': resolve('./external/petals'),
        '@kokiri': resolve('./external/kokiri'),
      },
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].template = resolve('./app/public/index.html');

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
        additionalData: `@import "~@kokiri/themes/antd/helper";`,
      },
    },
  },
  devServer: {
    disableHostCheck: true,
    before: app => mock(app, resolvePath('./app/mock/index.js')),
  },
};
