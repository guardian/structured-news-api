import * as moment from 'moment';
import { getDateFromString } from '../builderUtils';

describe('Converting strings to dates', () => {
  test("when passing an invalid string return today's date", () => {
    const date = moment();
    const todaysDate = `${date.year()}-${date.month() + 1}-${date.date()}`;
    const result = getDateFromString('Date');
    expect(result).toEqual(todaysDate);
  });

  test('when passing an valid string return the date', () => {
    const result = getDateFromString('"2019-02-10T06:29:43Z"');
    expect(result).toEqual('2019-2-10');
  });

  test("when a parameter is not provided return today's date", () => {
    const date = moment();
    const todaysDate = `${date.year()}-${date.month() + 1}-${date.date()}`;
    const result = getDateFromString();
    expect(result).toEqual(todaysDate);
  });
});
