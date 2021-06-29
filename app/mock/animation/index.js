const dataSource = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const animations = Object.keys(dataSource).map(id => ({ id, ...dataSource[id] }));

module.exports = {
  'GET /api/animations': animations,
  'GET /api/animations/:id': (req, res) => {
    const { id } = req.params;
    const data = dataSource[id];

    return data ? res.json({ ...data, id }) : res.status(404).json({});
  },
};
