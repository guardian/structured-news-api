interface CapiTrending {
  response: CapiMostViewed;
}

interface CapiMostViewed {
  mostViewed: Result[];
}

interface CapiEditorsPicks {
  response: EditorsPicks;
}

interface EditorsPicks {
  editorsPicks: Result[];
}

interface CapiResults {
  response: Results;
}

interface Results {
  results: Result[];
}

interface CapiResult {
  response: CapiResponse;
}

interface CapiResponse {
  content: Result;
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
  trailText: string;
}

interface Tag {
  id: string;
  type: string;
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
  CapiEditorsPicks,
};
