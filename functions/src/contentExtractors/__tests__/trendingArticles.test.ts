import { CapiTrending } from '../../models/capiModels';
import { Article } from '../../models/contentModels';
import {
  processTrendingArticles,
  isMorningBriefing,
} from '../trendingArticles';

describe('processTrendingArticles', () => {
  test('should transform a CapiTrending object into an Article', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/news',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
        ],
      },
    };

    const expectedResult = new Article(
      'First Article',
      '.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles without the news pillar ID', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/opinion',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/news',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
        ],
      },
    };

    const expectedResult = new Article(
      'Second Article',
      '.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });
  test('should ignore liveblogs', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/opinion',
            type: 'liveblog',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/news',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
        ],
      },
    };

    const expectedResult = new Article(
      'Second Article',
      '.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });

  test('should ignore the morning briefing', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/opinion',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [
              {
                id: 'world/series/guardian-morning-briefing',
              },
            ],
            blocks: {
              body: [],
            },
          },
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/news',
            type: '',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: '',
            },
            tags: [],
            blocks: {
              body: [],
            },
          },
        ],
      },
    };

    const expectedResult = new Article(
      'Second Article',
      '.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });
});

describe('isMorningBriefing', () => {
  test('should return true if Result has a morning briefing tag', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: '',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: '',
      },
      tags: [
        {
          id: 'world/series/guardian-morning-briefing',
        },
        {
          id: 'other tag',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isMorningBriefing(input)).toEqual(true);
  });

  test('should return false if Result has no morning briefing tag', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: '',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: '',
      },
      tags: [
        {
          id: 'other tag',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isMorningBriefing(input)).toEqual(false);
  });

  test('should return false if Result has no tags', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: '',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: '',
      },
      tags: [],
      blocks: {
        body: [],
      },
    };
    expect(isMorningBriefing(input)).toEqual(false);
  });
});
