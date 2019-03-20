import { isWeekdayAM, isSaturday, isSunday } from '../briefingSlotCheckers';
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
  test('should return true on Saturday from 6am', () => {
    const time = moment()
      .day('saturday')
      .hour(6);

    expect(isSaturday(time)).toEqual(true);
  });
  test('should return false on Saturday before 6am', () => {
    const time = moment()
      .day('saturday')
      .hour(5)
      .minute(59);

    expect(isSaturday(time)).toEqual(false);
  });
  test('should return false on Friday', () => {
    const time = moment().day('friday');

    expect(isSaturday(time)).toEqual(false);
  });
  test('should return true on Sunday before 6am', () => {
    const time = moment()
      .day('sunday')
      .hour(5)
      .minute(59);

    expect(isSaturday(time)).toEqual(true);
  });
  test('should return false on Sunday after 5:59am', () => {
    const time = moment()
      .day('sunday')
      .hour(6);

    expect(isSaturday(time)).toEqual(false);
  });
});

describe('isSunday', () => {
  test('should return true on Sunday from 6am', () => {
    const time = moment()
      .day('sunday')
      .hour(6);

    expect(isSunday(time)).toEqual(true);
  });
  test('should return false on Sunday before 6am', () => {
    const time = moment()
      .day('sunday')
      .hour(5)
      .minute(59);

    expect(isSunday(time)).toEqual(false);
  });

  test('should return false on Saturday', () => {
    const time = moment().day('saturday');

    expect(isSunday(time)).toEqual(false);
  });
  test('should return false on Monday after 5:59am', () => {
    const time = moment()
      .day('monday')
      .hour(6);

    expect(isSunday(time)).toEqual(false);
  });
  test('should return true on Monday before 6am', () => {
    const time = moment()
      .day('monday')
      .hour(5)
      .minute(59);

    expect(isSunday(time)).toEqual(true);
  });
});
