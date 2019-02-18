interface CapiResult {
  response: CapiResponse;
}

interface CapiResponse {
  content: Result;
}

interface CapiResults {
  response: Results;
}

interface Results {
  results: Result[];
}

interface Result {
  webPublicationDate: string;
  fields: Fields;
  blocks: Blocks;
}

interface Fields {
  standfirst: string;
  headline: string;
  body: string;
}

interface Blocks {
  body: Body[];
}

interface Body {
  elements: Element[];
}

interface Element {
  type: string;
  textTypeData?: Data;
}

interface Data {
  html: string;
}

export { Result, Element, CapiResults, CapiResult, Data };
