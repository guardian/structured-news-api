import { Article, ContentError, Podcast } from '../../models/contentModels';

import { CapiResults } from '../../models/capiModels';
import { processTodayInFocus } from '../todayInFocus';

describe('Process the results of Today in Focus query', () => {
  test('If there is a Today in Focus article that matches the query return an article', () => {
    const input: CapiResults = {
      response: {
        results: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: '',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline:
                "Why are homeless people still dying in one of Britain's richest cities?",
              standfirst:
                '<p>After a spike in deaths among homeless people in the affluent city of Oxford, Robert Booth went to investigate.In a growing community of rough sleepers, there is little support for people with mental health problems and addiction.Plus: Nosheen Iqbal on the ‘white fragility’ preventing a frank national discussion about racism</p>',
              body: '',
              bodyText: '',
              trailText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
        ],
      },
    };
    const expectedOutput = new Article(
      "Why are homeless people still dying in one of Britain's richest cities?",
      'After a spike in deaths among homeless people in the affluent city of Oxford, Robert Booth went to investigate. In a growing community of rough sleepers, there is little support for people with mental health problems and addiction.',
      'www.theguardian.com',
      Podcast.TODAYINFOCUS
    );
    expect(processTodayInFocus(input)).toEqual(expectedOutput);
  });

  test('If there is no Today in Focus article available return a Content Error object.', () => {
    const input: CapiResults = {
      response: {
        results: [],
      },
    };

    const expectedOutput = new ContentError(
      'No matches found for Today in Focus Query'
    );

    expect(processTodayInFocus(input)).toEqual(expectedOutput);
  });
});
