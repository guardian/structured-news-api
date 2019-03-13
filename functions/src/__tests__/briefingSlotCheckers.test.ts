import { isWeekdayAM, isSaturday } from '../briefingSlotCheckers';
import moment = require('moment');

describe('isWeekdayAM', () => {
  test("should return true if it's between 6:30am and 10:30am on Monday", () => {
    const time = moment()
      .day('monday')
      .hour(7);

    expect(isWeekdayAM(time)).toEqual(true);
  });

  test("should return true if it's between 6:30am and 10:30am on Friday", () => {
    const time = moment()
      .day('friday')
      .hour(9);

    expect(isWeekdayAM(time)).toEqual(true);
  });

  test("should return true if it's exactly 10:30am on a weekday", () => {
    const time = moment()
      .day('wednesday')
      .hour(10)
      .minute(30);

    expect(isWeekdayAM(time)).toEqual(true);
  });

  test("should return false if it's before 6:30am on a weekday", () => {
    const time = moment()
      .day('monday')
      .hour(6);

    expect(isWeekdayAM(time)).toEqual(true);
  });

  test("should return true if it's exactly 6:30am on a weekday", () => {
    const time = moment()
      .day('monday')
      .hour(6)
      .minute(30);

    expect(isWeekdayAM(time)).toEqual(true);
  });

  test("should return false if it's after 10:30am on a weekday", () => {
    const time = moment()
      .day('thursday')
      .hour(11)
      .minute(30);

    expect(isWeekdayAM(time)).toEqual(false);
  });

  test("should return false if it's Saturday", () => {
    const time = moment()
      .day('saturday')
      .hour(10)
      .minute(30);

    expect(isWeekdayAM(time)).toEqual(false);
  });

  test("should return false if it's Sunday", () => {
    const time = moment().day('sunday');

    expect(isWeekdayAM(time)).toEqual(false);
  });
});

describe('isSaturday', () => {
  test('should return true on Saturday', () => {
    const time = moment().day('saturday');

    expect(isSaturday(time)).toEqual(true);
  });
  test('should return false on Friday', () => {
    const time = moment().day('friday');

    expect(isSaturday(time)).toEqual(false);
  });
  test('should return false on Sunday', () => {
    const time = moment().day('sunday');

    expect(isSaturday(time)).toEqual(false);
  });
});
