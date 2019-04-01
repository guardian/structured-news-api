import { CapiEditorsPicks } from '../../models/capiModels';
import { Article, CapiTopArticles } from '../../models/contentModels';
import { processTopArticles, getAPIURL } from '../topArticles';
import { Locale } from '../../models/paramModels';

describe('processTopArticles', () => {
  test('should transform a CapiEditorsPicks object into a CapiTopArticles', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
    const article = new Article(
      'First Article',
      'Article.',
      'www.theguardian.com'
    );
    const expectedResult = new CapiTopArticles(
      article,
      article,
      article,
      article
    );
    expect(processTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles without the news pillar ID', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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

    const article = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    const expectedResult = new CapiTopArticles(
      article,
      article,
      article,
      article
    );
    expect(processTopArticles(input)).toEqual(expectedResult);
  });
  test('should ignore liveblogs', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
            sectionId: '',
            pillarId: 'pillar/news',
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
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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

    const article = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    const expectedResult = new CapiTopArticles(
      article,
      article,
      article,
      article
    );
    expect(processTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore the morning briefing', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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

    const article = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    const expectedResult = new CapiTopArticles(
      article,
      article,
      article,
      article
    );
    expect(processTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles with no bodyText', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
            sectionId: '',
            pillarId: 'pillar/news',
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
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
            id: '',
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

    const article = new Article(
      'Second Article',
      'Article.',
      'www.theguardian.com'
    );
    const expectedResult = new CapiTopArticles(
      article,
      article,
      article,
      article
    );
    expect(processTopArticles(input)).toEqual(expectedResult);
  });
});

describe('getAPIURL', () => {
  test('should use the UK edition with the GB locale', () => {
    expect(getAPIURL('123', Locale.GB)).toEqual(
      'http://content.guardianapis.com/uk?api-key=123&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=uk&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });

  test('should use the US edition with the US locale', () => {
    expect(getAPIURL('123', Locale.US)).toEqual(
      'http://content.guardianapis.com/us?api-key=123&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=us&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });

  test('should use the AU edition with the AU locale', () => {
    expect(getAPIURL('123', Locale.AU)).toEqual(
      'http://content.guardianapis.com/au?api-key=123&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=au&show-fields=headline,standfirst,body,bodyText&show-tags=all'
    );
  });
});
