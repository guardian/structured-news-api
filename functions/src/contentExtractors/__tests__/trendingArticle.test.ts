import { CapiTrending } from '../../models/capiModels';
import { Article, Podcast } from '../../models/contentModels';
import {
  processTrendingArticles,
  matchingURLInArticles,
  getAPIURL,
} from '../trendingArticle';
import { Locale } from '../../models/paramModels';

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
      'www.theguardian.com',
      []
    );
    expect(processTrendingArticles(input, [])).toEqual(expectedResult);
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
      'www.theguardian.com',
      []
    );
    expect(processTrendingArticles(input, [])).toEqual(expectedResult);
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
      'www.theguardian.com',
      []
    );
    expect(processTrendingArticles(input, [])).toEqual(expectedResult);
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
      'www.theguardian.com',
      []
    );
    expect(processTrendingArticles(input, [])).toEqual(expectedResult);
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
      'www.theguardian.com',
      []
    );
    expect(processTrendingArticles(input, [])).toEqual(expectedResult);
  });
});

describe('matchingURLInArticles', () => {
  test('should return false when the result URL does not match the URL of any articles included in the list of articles', () => {
    const article = {
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
    };
    const article1 = new Article(
      'headline',
      'standfirst',
      'www.guardian.com/a2',
      [],
      Podcast.LONGREAD
    );
    const article2 = new Article(
      'headline',
      'standfirst',
      'www.guardian.com/a3',
      [],
      Podcast.LONGREAD
    );
    const articles = [article1, article2];

    expect(matchingURLInArticles(article, articles)).toEqual(false);
  });

  test('should return true when the result URL matches the URL of any articles included in the list of articles', () => {
    const article = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: 'article',
      webUrl: 'www.theguardian.com/a1',
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
    };
    const article1 = new Article(
      'headline',
      'standfirst',
      'www.theguardian.com/a1',
      [],
      Podcast.LONGREAD
    );
    const article2 = new Article(
      'headline',
      'standfirst',
      'www.guardian.com/a3',
      [],
      Podcast.LONGREAD
    );
    const articles = [article1, article2];

    expect(matchingURLInArticles(article, articles)).toEqual(true);
  });

  test('should return false if list of Articles is empty', () => {
    const article = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: 'article',
      webUrl: 'www.theguardian.com/a1',
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
    };

    expect(matchingURLInArticles(article, [])).toEqual(false);
  });
});

describe('getAPIURL', () => {
  test('should use the UK edition with the GB locale', () => {
    expect(getAPIURL('123', Locale.GB)).toEqual(
      'http://content.guardianapis.com/uk?api-key=123&page-size=30&show-most-viewed=true&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });

  test('should use the US edition with the US locale', () => {
    expect(getAPIURL('123', Locale.US)).toEqual(
      'http://content.guardianapis.com/us?api-key=123&page-size=30&show-most-viewed=true&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });

  test('should use the AU edition with the AU locale', () => {
    expect(getAPIURL('123', Locale.AU)).toEqual(
      'http://content.guardianapis.com/au?api-key=123&page-size=30&show-most-viewed=true&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });
});
