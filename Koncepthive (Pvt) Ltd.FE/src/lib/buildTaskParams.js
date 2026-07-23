export function buildTaskParams(query) {
  const params = {};

  if (query.search) params.search = query.search;
  if (query.status) params.status = query.status;
  if (query.priority) params.priority = query.priority;
  if (query.sort && query.sort !== "newest") params.sort = query.sort;
  if (query.page > 1) params.page = String(query.page);
  if (query.limit !== 10) params.limit = String(query.limit);

  return params;
}