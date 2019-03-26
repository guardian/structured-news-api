import { getLocaleParam } from '../paramsHelpers';
import { Locale } from '../models/paramModels';

describe('getLocaleParam', () => {
  test('should return GB locale if given the en-GB input', () => {
    expect(getLocaleParam('en-GB')).toEqual(Locale.GB);
  });

  test('should return US locale if given the en-IN input', () => {
    expect(getLocaleParam('en-IN')).toEqual(Locale.GB);
  });

  test('should return GB locale if given the en-SG input', () => {
    expect(getLocaleParam('en-SG')).toEqual(Locale.GB);
  });

  test('should return GB locale if given an unknown input', () => {
    expect(getLocaleParam('unknown')).toEqual(Locale.GB);
  });

  test('should return US locale if given the en-CA input', () => {
    expect(getLocaleParam('en-CA')).toEqual(Locale.US);
  });

  test('should return US locale if given the en-US input', () => {
    expect(getLocaleParam('en-US')).toEqual(Locale.US);
  });

  test('should return AU locale if given the en-AU input', () => {
    expect(getLocaleParam('en-AU')).toEqual(Locale.AU);
  });
});
