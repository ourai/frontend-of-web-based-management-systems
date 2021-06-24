const dataSource = require('./data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const games = Object.keys(dataSource).map(id => ({ id, ...dataSource[id] }));

module.exports = {
  'GET /api/games': games,
};
