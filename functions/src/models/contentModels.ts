class OptionContent {}

class Article extends OptionContent {
  constructor(public headline: string, public standfirst: string) {
    super();
  }
}

class TopStories extends OptionContent {
  constructor(
    public story1: Article,
    public story2: Article,
    public story3: Article
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

class APIResponse extends OptionContent {
  constructor(
    public date: string,
    public morningBriefing: MorningBriefing,
    public ssml: string,
    public audioFileLocation: string
  ) {
    super();
  }
}

class MorningBriefing {
  constructor(
    public topStories?: TopStories,
    public todayInFocus?: Article,
    public trendingArticle?: Article
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
  OptionContent,
  ContentError,
  TopStories,
  Article,
  URL,
  APIResponse,
  OptionIndex,
  Index,
  OutOfBounds,
  MorningBriefing,
};
