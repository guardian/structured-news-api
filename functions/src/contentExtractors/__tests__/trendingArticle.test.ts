import { CapiTrending } from '../../models/capiModels';
import { Article } from '../../models/contentModels';
import { processTrendingArticles } from '../trendingArticle';

describe('processTrendingArticles', () => {
  test('should transform a CapiTrending object into an Article', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/news',
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
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

    const expectedResult = new Article(
      'First Article',
      'Article.',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
              trailText: '',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
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

    const expectedResult = new Article(
      'Second Article',
      'Article.',
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
              bodyText: 'Article',
              trailText: '',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
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

    const expectedResult = new Article(
      'Second Article',
      'Article.',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
              trailText: '',
            },
            tags: [
              {
                id: 'world/series/guardian-morning-briefing',
                type: 'series',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
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

    const expectedResult = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles with no bodyText', () => {
    const input: CapiTrending = {
      response: {
        mostViewed: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            sectionId: '',
            pillarId: 'pillar/opinion',
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'First Article',
              standfirst: '',
              body: '',
              bodyText: '',
              trailText: '',
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
            type: 'article',
            webUrl: 'www.theguardian.com',
            fields: {
              headline: 'Second Article',
              standfirst: '',
              body: '',
              bodyText: 'Article',
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

    const expectedResult = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    expect(processTrendingArticles(input)).toEqual(expectedResult);
  });
});
