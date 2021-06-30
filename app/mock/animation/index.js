const { getPagination, getPaginated, resolveResult } = require('../helper'); // eslint-disable-line @typescript-eslint/no-var-requires
const dataSource = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const animations = Object.keys(dataSource).map(id => ({ id, ...dataSource[id] }));

module.exports = {
  'GET /api/animations': (req, res) => {
    const { pageSize, pageNum } = getPagination(req.query);

    return res.json(
      resolveResult(getPaginated(animations, { pageSize, pageNum }), {
        extra: { pageNum, pageSize, total: animations.length },
      }),
    );
  },
  'GET /api/animations/:id': (req, res) => {
    const { id } = req.params;
    const data = animations.find(({ id: animeId }) => animeId === id);

    return data
      ? res.json(resolveResult({ ...data, id }))
      : res.json(
          resolveResult(undefined, {
            success: false,
            code: '404',
            message: `动画 \`${id}\` 不存在`,
          }),
        );
  },
};
