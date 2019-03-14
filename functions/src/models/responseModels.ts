import { Article } from './contentModels';

class APIResponse {}

class SuccessAPIResponse implements APIResponse {
  constructor(
    public content: BriefingContent,
    public ssml: string,
    public audioFileLocation: string
  ) {}
}

class FailAPIResponse implements APIResponse {
  constructor(public error: string) {}
}

class BriefingContent {
  constructor(
    public item1: Article,
    public item2: Article,
    public item3: Article,
    public item4: Article,
    public item5: Article
  ) {}
}

export { APIResponse, BriefingContent, SuccessAPIResponse, FailAPIResponse };
