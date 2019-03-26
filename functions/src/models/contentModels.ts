enum BriefingTemplate {
  GBWEEKDAYAM = 'gbweekdayam',
  GBSATURDAY = 'gbsaturday',
  GBSUNDAY = 'gbsunday',
  GBFALLBACK = 'gbfallback',
  AUFALLBACK = 'aufallback',
  USFALLBACK = 'usfallback',
}

class OptionContent {}

class Article extends OptionContent {
  constructor(
    public headline: string,
    public standfirst: string,
    public source: string,
    public podcast: Podcast = Podcast.NONE
  ) {
    super();
  }
}

enum Podcast {
  TODAYINFOCUS = 'todayinfocus',
  LONGREAD = 'longread',
  NONE = 'none',
}

class AudioLongReads extends OptionContent {
  constructor(public latestLongRead: Article, public olderLongRead: Article) {
    super();
  }
}

class TopStories extends OptionContent {
  constructor(
    public story1: Article,
    public story2: Article,
    public story3: Article,
    public story4: Article
  ) {
    super();
  }
}

class URL extends OptionContent {
  constructor(public url: string) {
    super();
  }
}

class ContentError extends OptionContent {
  constructor(public errorMessage: string) {
    super();
  }
}

class CapiTopArticles extends OptionContent {
  constructor(
    public article1: Article,
    public article2: Article,
    public article3: Article,
    public article4: Article
  ) {
    super();
  }
}

class WeekdayAMBriefing {
  constructor(public topStories: TopStories, public todayInFocus: Article) {}
}

class FallbackBriefing {
  constructor(
    public topArticles: CapiTopArticles,
    public trendingArticle: Article
  ) {}
}

class WeekendBriefing {
  constructor(
    public topArticles: CapiTopArticles,
    public audioLongRead: Article,
    public trendingArticle: Article
  ) {}
}

class OptionIndex {}

class Index extends OptionIndex {
  constructor(public index: number) {
    super();
  }
}

class OutOfBounds extends OptionIndex {
  constructor() {
    super();
  }
}

export {
  BriefingTemplate,
  OptionContent,
  ContentError,
  TopStories,
  Article,
  URL,
  OptionIndex,
  Index,
  OutOfBounds,
  CapiTopArticles,
  AudioLongReads,
  FallbackBriefing,
  WeekendBriefing,
  WeekdayAMBriefing,
  Podcast,
};
