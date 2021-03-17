import moment from 'moment';

const convertIsoDateToObject = date => {
  const _date = moment(date).utc();
  return { day: _date.date(), month: _date.month() + 1, year: _date.year() };
};

const convertObjectToIsoDate = date => {
  if (!date || !date.year || !date.month || !date.day) return null;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).toISOString();
};

const convertIsoDateToString = date => {
  return moment(date)
    .utc()
    .format('DD/MM/YYYY');
};

const convertIsoDateToYears = date => {
  return moment().diff(date, 'years', false);
};

export {
  convertIsoDateToObject,
  convertIsoDateToString,
  convertIsoDateToYears,
  convertObjectToIsoDate
};
