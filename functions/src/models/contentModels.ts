class OptionContent {}

class Article extends OptionContent {
  constructor(
    public headline: string,
    public standfirst: string,
    public source: string
  ) {
    super();
  }
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

class FallbackTopStories extends OptionContent {
  constructor(
    public story1: Article,
    public story2: Article,
    public story3: Article,
    public story4: Article
  ) {
    super();
  }
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
  OptionIndex,
  Index,
  OutOfBounds,
  FallbackTopStories,
  AudioLongReads,
};
