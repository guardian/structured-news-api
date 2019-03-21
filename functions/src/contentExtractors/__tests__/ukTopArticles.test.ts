import { CapiEditorsPicks } from '../../models/capiModels';
import { Article, CapiTopArticles } from '../../models/contentModels';
import { processUKTopArticles } from '../ukTopArticles';

describe('processUKTopArticles', () => {
  test('should transform a CapiEditorsPicks object into a CapiTopArticles', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
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
    expect(processUKTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles without the news pillar ID', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
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
    expect(processUKTopArticles(input)).toEqual(expectedResult);
  });
  test('should ignore liveblogs', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
          {
            webPublicationDate: '2019-02-11T03:00:06Z',
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
    expect(processUKTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore the morning briefing', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
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
    expect(processUKTopArticles(input)).toEqual(expectedResult);
  });

  test('should ignore articles with no bodyText', () => {
    const input: CapiEditorsPicks = {
      response: {
        editorsPicks: [
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
    expect(processUKTopArticles(input)).toEqual(expectedResult);
  });
});