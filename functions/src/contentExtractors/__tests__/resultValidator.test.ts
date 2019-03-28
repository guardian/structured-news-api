import {
  isMorningBriefing,
  isValidResult,
  hasGuardianReadersProfile,
  hasToneTagAnalysis,
  isNewTopic,
} from '../resultValidator';
import { Article } from '../../models/contentModels';

describe('isNewTopic', () => {
  test('should return false if the result is similar to any of the Articles', () => {
    const result = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body:
          'Michael Gove has admitted the government’s plan to waive all tariffs on goods crossing the Irish border into Northern Ireland in the event of a no-deal Brexit could be legally challenged under World Trade Organization rules.',
        bodyText:
          'Michael Gove has admitted the government’s plan to waive all tariffs on goods crossing the Irish border into Northern Ireland in the event of a no-deal Brexit could be legally challenged under World Trade Organization rules.',
        trailText: '',
      },
      tags: [
        {
          id: 'politics/eu-referendum',
          type: 'keyword',
        },
        {
          id: 'politics/oliverletwin',
          type: 'keyword',
        },
        {
          id: 'politics/conservatives',
          type: 'keyword',
        },
        {
          id: 'politics/theresamay',
          type: 'keyword',
        },
        {
          id: 'politics/article-50',
          type: 'keyword',
        },
        {
          id: 'world/eu',
          type: 'keyword',
        },
        {
          id: 'politics/politics',
          type: 'keyword',
        },
        {
          id: 'uk/uk',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    const articles = [
      new Article(
        '',
        'The developer who built and owns the housing complex where children of social housing were barred from using shared playgrounds has now said all children can play there, following a Guardian Cities investigation.',
        '',
        [
          {
            id: 'politics/conservatives',
            type: 'keyword',
          },
          {
            id: 'politics/theresamay',
            type: 'keyword',
          },
          {
            id: 'politics/article-50',
            type: 'keyword',
          },
          {
            id: 'world/eu',
            type: 'keyword',
          },
          {
            id: 'politics/politics',
            type: 'keyword',
          },
          {
            id: 'uk/uk',
            type: 'keyword',
          },
          {
            id: 'media/pressandpublishing',
            type: 'keyword',
          },
          {
            id: 'world/europe-news',
            type: 'keyword',
          },
          {
            id: 'media/media',
            type: 'keyword',
          },
        ]
      ),
      new Article(
        '',
        'Young people living with higher levels of air pollution are significantly more likely to have psychotic experiences, according to the first study of the issue.',
        '',
        []
      ),
    ];
    expect(isNewTopic(result, articles)).toEqual(false);
  });

  test('should return true if the result is not similar to any of the Articles', () => {
    const result = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body:
          'Young people living with higher levels of air pollution are significantly more likely to have psychotic experiences, according to the first study of the issue.',
        bodyText:
          'Young people living with higher levels of air pollution are significantly more likely to have psychotic experiences, according to the first study of the issue.',
        trailText: '',
      },
      tags: [
        {
          id: 'tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    const articles = [
      new Article(
        '',
        'The developer who built and owns the housing complex where children of social housing were barred from using shared playgrounds has now said all children can play there, following a Guardian Cities investigation.',
        '',
        [
          {
            id: 'other tag',
            type: 'keyword',
          },
        ]
      ),
      new Article(
        '',
        'Young people living with higher levels of air pollution are significantly more likely to have psychotic experiences, according to the first study of the issue.',
        '',
        []
      ),
    ];
    expect(isNewTopic(result, articles)).toEqual(true);
  });
});

describe('isValidResult', () => {
  test('should return true if result is valid', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(true);
  });
  test('should return false if result is not of type article', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'interactive',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'tag',
          type: 'series',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(false);
  });
  test('should return false if result does not have the news pillar id', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: 'body',
        bodyText: '',
        trailText: '',
      },
      tags: [
        {
          id: 'tag',
          type: 'series',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(false);
  });
  test('should return false if result does not have any body text', () => {
    const input = {
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
      tags: [
        {
          id: 'tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(false);
  });
  test('should return false if result has the morning briefing tag on it', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'world/series/guardian-morning-briefing',
          type: 'series',
        },
        {
          id: 'tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(false);
  });

  test('should return false if result has the analysis tone tag on it', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/news',
      type: 'article',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: '',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'tone/analysis',
          type: 'tone',
        },
        {
          id: 'tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };
    expect(isValidResult(input)).toEqual(false);
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'world/series/guardian-morning-briefing',
          type: 'series',
        },
        {
          id: 'other tag',
          type: 'tracking',
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'other tag',
          type: 'contributor',
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [],
      blocks: {
        body: [],
      },
    };
    expect(isMorningBriefing(input)).toEqual(false);
  });
});

describe('hasGuardianReaderProfile', () => {
  test('should return true on content which has the guardian reader tag on it', () => {
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'profile/guardian-readers',
          type: 'contributor',
        },
        {
          id: 'other tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasGuardianReadersProfile(input)).toEqual(true);
  });

  test('should return false on content which does not have the guardian reader tag on it', () => {
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'other tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasGuardianReadersProfile(input)).toEqual(false);
  });

  test('should return false on content which does not have the guardian reader tag on it and has a tag of type "contributor" on it', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: '',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: 'body',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'other tag',
          type: 'contributor',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasGuardianReadersProfile(input)).toEqual(false);
  });
});

describe('hasToneTagAnalysis', () => {
  test('should return true on content which has an analysis tag on it', () => {
    const input = {
      webPublicationDate: '2019-02-11T03:00:06Z',
      sectionId: '',
      pillarId: 'pillar/opinion',
      type: '',
      webUrl: 'www.theguardian.com',
      fields: {
        headline: 'First Article',
        standfirst: '',
        body: 'body',
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'tone/analysis',
          type: 'tone',
        },
        {
          id: 'other tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasToneTagAnalysis(input)).toEqual(true);
  });

  test('should return false on content which does not have an analysis tag on it', () => {
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'other tag',
          type: 'keyword',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasToneTagAnalysis(input)).toEqual(false);
  });

  test('should return false on content which does not have an analysis tag on it and has a tag of type "tone" on it', () => {
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
        bodyText: 'text',
        trailText: '',
      },
      tags: [
        {
          id: 'other tag',
          type: 'tone',
        },
      ],
      blocks: {
        body: [],
      },
    };

    expect(hasToneTagAnalysis(input)).toEqual(false);
  });
});
