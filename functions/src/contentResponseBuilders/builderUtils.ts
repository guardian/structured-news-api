import * as moment from 'moment';

// If date is invalid return today's date
const getDateFromString = (date?: string): string => {
  let d = moment();
  if (date !== undefined && moment(date, 'YYYY-MM-DD').isValid()) {
    d = moment(date, 'YYYY-MM-DD');
  }
  // Adding 1 to account that months go from 0 to 11
  return `${d.year()}-${d.month() + 1}-${d.date()}`;
};

export { getDateFromString };
