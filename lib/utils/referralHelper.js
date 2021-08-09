export const getRecentStatus = history => {
  if (!history) return 'NO_STATUS';
  return history.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })[0];
};
