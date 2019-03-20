import {
  isMorningBriefing,
  isValidResult,
  hasGuardianReadersProfile,
} from '../resultValidator';

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
        body: 'body',
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
        body: 'body',
        bodyText: '',
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
        bodyText: '',
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
        bodyText: '',
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
        bodyText: '',
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
        bodyText: '',
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

    expect(hasGuardianReadersProfile(input)).toEqual(true);
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
        body: '',
        bodyText: '',
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

    expect(hasGuardianReadersProfile(input)).toEqual(true);
  });
});
