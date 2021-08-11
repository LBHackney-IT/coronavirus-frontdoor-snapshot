export const getRecentStatus = history => {
  if (!history) return 'NO_STATUS';
  return history.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })[0];
};

// Splits address string into multiple lines by comma. Also appends
// postcode to a new line.
export const parseAddress = (addressLines, postcode = null) => {
  addressLines = addressLines ? addressLines.split(/,\s*/g) : [];
  return addressLines
    .concat([postcode])
    .filter(x => x)
    .join('\n');
};
