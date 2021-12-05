import { defineConfig } from 'umi';
import routes from './src/entry/routes'
const { join: joinPath } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

function resolve(dir) {
  return joinPath(__dirname, dir);
}

export default defineConfig({
  alias:{
    '@zora/core/dist': resolve('./external/zora-core/src'),
    '@zora/adapter-ant-design/dist': resolve('./external/zora-antd/src'),
    '@zora/adapter-ant-design': resolve('./external/zora-antd/src/index.ts'),
    'handie-react/dist': resolve('./external/handie-react/src'),
    'handie-react': resolve('./external/handie-react/src/index.ts'),
    '@handie/squirtle/dist': resolve('./external/squirtle/src'),
    '@handie/squirtle': resolve('./external/squirtle/src/index.ts'),
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
});
