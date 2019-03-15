import { FallbackTopStories, Article, TopStories } from './contentModels';

abstract class APIResponse {
  constructor(public ssml: string, public audioFileLocation: string) {}
}

class WeekdayAMBriefing {
  constructor(
    public topStories: TopStories,
    public todayInFocus: Article,
    public trendingArticle: Article
  ) {}
}

class WeekdayAMResponse extends APIResponse {
  constructor(
    public weekdayAMBriefing: WeekdayAMBriefing,
    public ssml: string,
    public audioFileLocation: string
  ) {
    super(ssml, audioFileLocation);
  }
}

class FallbackBriefing {
  constructor(
    public topStories: FallbackTopStories,
    public trendingArticle: Article
  ) {}
}

class WeekendBriefing {
  constructor(
    public topStories: FallbackTopStories,
    public audioLongRead: Article,
    public trendingArticle: Article
  ) {}
}

class FallbackResponse extends APIResponse {
  constructor(
    public fallbackBriefing: FallbackBriefing,
    public ssml: string,
    public audioFileLocation: string
  ) {
    super(ssml, audioFileLocation);
  }
}

export {
  WeekdayAMResponse,
  FallbackResponse,
  WeekdayAMBriefing,
  APIResponse,
  FallbackBriefing,
  WeekendBriefing,
};
