const { join: joinPath, resolve: resolvePath } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires
const mock = require('mocker-api'); // eslint-disable-line @typescript-eslint/no-var-requires

function resolve(dir) {
  return joinPath(__dirname, dir);
}

const APP_SRC = './src';

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
        // '@kokiri/core/dist': resolve('./external/kokiri-core/src'),
        // 'kokiri/dist': resolve('./external/kokiri/src'),
        // kokiri: resolve('./external/kokiri/src/index.ts'),
        // '@kokiri/element/dist': resolve('./external/kokiri-element/src'),
        // '@kokiri/element': resolve('./external/kokiri-element/src/index.ts'),
        // '@kokiri/view-ui/dist': resolve('./external/kokiri-iview/src'),
        // '@kokiri/view-ui': resolve('./external/kokiri-iview/src/index.ts'),
        // organik: resolve('./external/organik/src'),
        // '@handie/runtime-core/dist': resolve('./external/handie-core/src'),
        // '@handie/runtime-core': resolve('./external/handie-core/src/index.ts'),
        // 'handie-vue/dist': resolve('./external/handie-vue/src'),
        // 'handie-vue': resolve('./external/handie-vue/src/index.ts'),
        // '@handie/bulbasaur/dist': resolve('./external/bulbasaur/src'),
        // '@handie/bulbasaur': resolve('./external/bulbasaur/src/index.ts'),
      },
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].template = resolve('./public/index.html');

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
    before: app => mock(app, resolvePath('../../mock/index.js')),
  },
};
