import * as moment from 'moment';

// The weekday AM briefing slot is between 6:30am and 10:30am Monday - Friday
const isWeekdayAM = (time: moment.Moment): boolean => {
  const hour = time.hour();
  const minute = time.minute();
  const dayOfWeek = time.day();

  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
  const isAfter1030AM = (hour >= 10 && minute > 30) || hour >= 11;
  const isAfter630AM = (hour >= 6 && minute > 30) || hour >= 6;

  return isWeekday && isAfter630AM && !isAfter1030AM;
};

const isSaturday = (time: moment.Moment): boolean => {
  const dayOfWeek = time.day();
  return dayOfWeek === 6;
};

const isSunday = (time: moment.Moment): boolean => {
  const dayOfWeek = time.day();
  return dayOfWeek === 0;
};

export { isWeekdayAM, isSaturday, isSunday };
