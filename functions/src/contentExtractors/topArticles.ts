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
import { Locale } from '../models/paramModels';

/*
Current rules for Top Articles:
Top articles from CAPI based on showing only editors picks
First sentence each story
Uses resultValidator to check if an article should be included in the top articles
*/

const numberOfArticlesNeeded = 4;

const getTopArticles = (
  capiKey: string,
  locale: Locale
): Promise<OptionContent> => {
  return fetch(getAPIURL(capiKey, locale))
    .then<CapiEditorsPicks>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processTopArticles(capiResponse);
    })
    .catch(e => {
      console.error(`Unable to get Top Articles. Error: ${e}`);
      return new ContentError('Could not get Top Articles');
    });
};

const getAPIURL = (capiKey: string, locale: Locale) => {
  const url = (edition: string) => {
    return `http://content.guardianapis.com/${edition}?api-key=${capiKey}&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=${edition}&show-fields=headline,standfirst,body,bodyText&show-tags=all`;
  };

  switch (locale) {
    case Locale.GB:
      return url('uk');
    case Locale.US:
      return url('us');
    case Locale.AU:
      return url('au');
  }
};

const processTopArticles = (capiResponse: CapiEditorsPicks): OptionContent => {
  const articles = capiResponse.response.editorsPicks;
  const topArticles: Article[] = [];
  let i = 0;
  while (i < articles.length && topArticles.length < numberOfArticlesNeeded) {
    const article = articles[i];
    if (isValidResult(article)) {
      const a = new Article(
        article.fields.headline,
        getFirstSentence(article.fields.bodyText),
        article.webUrl,
        article.tags
      );
      topArticles.push(a);
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
    return new ContentError('Could not get Top Articles');
  }
};

export { getTopArticles, processTopArticles, getAPIURL };
