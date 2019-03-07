import * as moment from 'moment';

import { getDateFromString, getTextBlocksFromArticle } from '../utils';

import { Result } from '../models/capiModels';

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

describe('Extract text elements from article', () => {
  test('All non text elements should be removed', () => {
    const input: Result = {
      webPublicationDate: '2019-02-13T06:29:06Z',
      type: '',
      pillarId: '',
      sectionId: '',
      webUrl: '',
      fields: {
        headline: '',
        standfirst: '',
        body: '',
        bodyText: '',
      },
      blocks: {
        body: [
          {
            elements: [
              {
                type: 'text',
                textTypeData: {
                  html: '<h2>Fun Title</h2>\n<p>Fun html</p>',
                },
              },
              {
                type: 'image',
              },
              {
                type: 'text',
                textTypeData: {
                  html: '<p>More fun html</p>',
                },
              },
            ],
          },
        ],
      },
    };
    const expectedOutput = [
      '<h2>Fun Title</h2>',
      '<p>Fun html</p><p>More fun html</p>',
    ];
    expect(getTextBlocksFromArticle(input)).toEqual(expectedOutput);
  });
});
