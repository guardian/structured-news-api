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

class FallbackResponse extends APIResponse {
  constructor(
    public topStories: FallbackTopStories,
    public trendingArticle: Article,
    public ssml: string,
    public audioFileLocation: string
  ) {
    super(ssml, audioFileLocation);
  }
}

export { WeekdayAMResponse, FallbackResponse, WeekdayAMBriefing, APIResponse };
