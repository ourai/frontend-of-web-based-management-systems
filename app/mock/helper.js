function getPagination(query = {}) {
  const { pageNum = 1, pageSize = 20 } = query;

  return { pageNum: +pageNum, pageSize: +pageSize };
}

function getPaginated(dataSource, { pageNum, pageSize }) {
  const startAt = (pageNum - 1) * pageSize;

  return dataSource.slice(startAt, startAt + pageSize);
}

function resolveResult(data, others = {}) {
  return { success: true, data, ...others };
}

module.exports = { getPagination, getPaginated, resolveResult };
