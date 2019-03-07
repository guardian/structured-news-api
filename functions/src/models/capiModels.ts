interface CapiTrending {
  response: CapiMostViewed;
}

interface CapiMostViewed {
  mostViewed: Result[];
}

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
  type: string;
  sectionId: string;
  pillarId: string;
  webPublicationDate: string;
  webUrl: string;
  fields: Fields;
  blocks: Blocks;
  tags: Tag[];
}

interface Fields {
  standfirst: string;
  headline: string;
  body: string;
  bodyText: string;
}

interface Tag {
  id: string;
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

export {
  Result,
  Element,
  CapiResults,
  CapiResult,
  Data,
  CapiMostViewed,
  CapiTrending,
};
