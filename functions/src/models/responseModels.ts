import { Article } from './contentModels';

class APIResponse {}

class SuccessAPIResponse implements APIResponse {
  constructor(
    public content: Article[],
    public ssml: string[],
    public audioFileLocation: string[]
  ) {}
}

class FailAPIResponse implements APIResponse {
  constructor(public error: string) {}
}

export { APIResponse, SuccessAPIResponse, FailAPIResponse };
