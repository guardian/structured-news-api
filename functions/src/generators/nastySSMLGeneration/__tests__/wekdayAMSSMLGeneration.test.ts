import { generateTodayInFocusStandfirst } from '../weekdayAMSSMLGeneration';

describe('generateTodayInFocusStandfirst', () => {
  test('should separate the today in focus standfirst sentences with breaks', () => {
    const input = 'Sentence1. Sentence2.';
    const expectedOutput =
      "Sentence1. <break strength='strong'/> Sentence2. <break strength='strong'/>";
    expect(generateTodayInFocusStandfirst(input)).toEqual(expectedOutput);
  });
});
