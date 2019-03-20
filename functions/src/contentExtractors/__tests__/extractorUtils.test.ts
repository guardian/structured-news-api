import { getTextBlocksFromArticle } from '../extractorUtils';

import { Result } from '../../models/capiModels';

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
        trailText: '',
      },
      tags: [],
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
