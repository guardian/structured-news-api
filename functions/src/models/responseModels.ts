import { Article } from './contentModels';

class APIResponse {}

class SuccessAPIResponse implements APIResponse {
  constructor(
    public content: Article[],
    public ssml: [string] | [string, string],
    public audioFileLocation: [string] | [string, string]
  ) {}
}

class FailAPIResponse implements APIResponse {
  constructor(public error: string) {}
}

export { APIResponse, SuccessAPIResponse, FailAPIResponse };
