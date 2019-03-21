import { CapiEditorsPicks } from '../models/capiModels';
import {
  Article,
  ContentError,
  CapiTopArticles,
  OptionContent,
} from '../models/contentModels';
import fetch from 'node-fetch';
import { getFirstSentence } from './extractorUtils';
import { isValidResult } from './resultValidator';

/*
Current rules for uk Top Articles:
Top articles from CAPI based on showing only editors picks
First sentence each story
Uses resultValidator to check if an article should be included in the top articles
*/

const numberOfArticlesNeeded = 4;

const getUkTopArticles = (capiKey: string): Promise<OptionContent> => {
  const topArticles = `http://content.guardianapis.com/uk?api-key=${capiKey}&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=uk&show-fields=headline,standfirst,body,bodyText&show-tags=all`;
  return fetch(topArticles)
    .then<CapiEditorsPicks>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processUKTopArticles(capiResponse);
    })
    .catch(e => {
      console.error(`Unable to get UK Top Articles. Error: ${e}`);
      return new ContentError('Could not get UK Top Articles');
    });
};

const processUKTopArticles = (
  capiResponse: CapiEditorsPicks
): OptionContent => {
  const articles = capiResponse.response.editorsPicks;
  const topArticles: Article[] = [];
  let i = 0;
  while (i < articles.length && topArticles.length < numberOfArticlesNeeded) {
    const article = articles[i];
    if (isValidResult(article)) {
      topArticles.push(
        new Article(
          article.fields.headline,
          getFirstSentence(article.fields.bodyText),
          article.webUrl
        )
      );
    }
    i++;
  }
  if (topArticles.length === numberOfArticlesNeeded) {
    return new CapiTopArticles(
      topArticles[0],
      topArticles[1],
      topArticles[2],
      topArticles[3]
    );
  } else {
    return new ContentError('Could not get UK top Articles');
  }
};

export { getUkTopArticles, processUKTopArticles };
