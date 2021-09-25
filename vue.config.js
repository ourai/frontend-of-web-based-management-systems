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
        // 'petals-ui/dist': resolve('./external/petals-ui/packages/petals/src'),
        // '@kokiri/core/dist': resolve('./external/kokiri/packages/core/src'),
        // '@kokiri/view-ui/dist': resolve('./external/kokiri/packages/view-ui/src'),
        // '@kokiri/view-ui': resolve('./external/kokiri/packages/view-ui/src/index.ts'),
        // 'handie-vue/dist': resolve('./external/handie-vue/src'),
        // 'handie-vue': resolve('./external/handie-vue/src/index.ts'),
        // '@handie/bulbasaur/dist': resolve('./external/bulbasaur/src'),
        // '@handie/bulbasaur': resolve('./external/bulbasaur/src/index.ts'),
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
        additionalData: `@import "kokiri/dist/themes/antd/helper";`,
      },
    },
  },
  devServer: {
    disableHostCheck: true,
    before: app => mock(app, resolvePath('./app/mock/index.js')),
  },
};
