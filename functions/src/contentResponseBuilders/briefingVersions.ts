import * as moment from 'moment';
import { Locale } from '../models/paramModels';
import { BriefingTemplate } from '../models/contentModels';

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

// We define Saturday as 6am on Saturday to 5:59am on Sunday
const isSaturday = (time: moment.Moment): boolean => {
  const hour = time.hour();
  const minute = time.minute();
  const dayOfWeek = time.day();
  const validSaturday = dayOfWeek === 6 && hour >= 6;
  const validSunday = dayOfWeek === 0 && hour <= 5 && minute <= 59;
  return validSaturday || validSunday;
};
// We define Sunday as 6am on Sunday to 5:59am on Monday
const isSunday = (time: moment.Moment): boolean => {
  const hour = time.hour();
  const minute = time.minute();
  const dayOfWeek = time.day();
  const validSunday = dayOfWeek === 0 && hour >= 6;
  const validMonday = dayOfWeek === 1 && hour <= 5 && minute <= 59;
  return validSunday || validMonday;
};

const getBriefingVersion = (locale: Locale): BriefingTemplate => {
  switch (locale) {
    case Locale.AU:
      return BriefingTemplate.GBFALLBACK;
    case Locale.US:
      return BriefingTemplate.GBFALLBACK;
    case Locale.GB:
      return getGBBriefingVersion();
  }
};

const getGBBriefingVersion = () => {
  const currentTime = moment().utc();
  if (isWeekdayAM(currentTime)) {
    return BriefingTemplate.GBWEEKDAYAM;
  }
  if (isSaturday(currentTime)) {
    return BriefingTemplate.GBSATURDAY;
  }
  if (isSunday(currentTime)) {
    return BriefingTemplate.GBSUNDAY;
  } else {
    return BriefingTemplate.GBFALLBACK;
  }
};

export { isWeekdayAM, isSaturday, isSunday, getBriefingVersion };
