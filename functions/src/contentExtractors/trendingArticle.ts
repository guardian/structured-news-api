import { Article, ContentError } from '../models/contentModels';

import { CapiTrending, Result } from '../models/capiModels';
import fetch from 'node-fetch';
import { getSentencesFromText } from './extractorUtils';
import { isValidResult } from './resultValidator';
import { Locale } from '../models/paramModels';

/*
Current rules for trendingArticles:
The top story from most viewed according to CAPI. Uses either /UK or /US or /AU depending on locale provided
First sentence of top story
Uses resultValidator to check if an article should be included in the top stories
*/

const getTrendingArticle = (
  capiKey: string,
  existingArticles: Article[] = [],
  locale: Locale
): Promise<Article | ContentError> => {
  return fetch(getAPIURL(capiKey, locale))
    .then<CapiTrending>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processTrendingArticles(capiResponse, existingArticles);
    })
    .catch(e => {
      console.error(`Unable to get Trending Articles. Error: ${e}`);
      return new ContentError('Could not get Trending Articles');
    });
};

const getAPIURL = (capiKey: string, locale: Locale) => {
  const url = (edition: string) => {
    return `http://content.guardianapis.com/${edition}?api-key=${capiKey}&page-size=30&show-most-viewed=true&show-fields=headline,standfirst,body,bodyText&show-tags=all`;
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

const processTrendingArticles = (
  results: CapiTrending,
  existingArticles: Article[]
): Article | ContentError => {
  if (results.response.mostViewed.length < 1) {
    console.error('No matches for Trending Articles query');
    return new ContentError('No matches found for Trending Articles Query');
  } else {
    const articles = results.response.mostViewed;
    let foundArticle = false;
    let i = 0;
    let article = new Article('', '', '');
    while (!foundArticle && i < articles.length) {
      const currentArticle = articles[i];
      if (
        isValidResult(currentArticle) &&
        !matchingURLInArticles(currentArticle, existingArticles)
      ) {
        const fields = articles[i].fields;
        article = new Article(
          fields.headline,
          getSentencesFromText(fields.bodyText, 1),
          currentArticle.webUrl
        );
        foundArticle = true;
      }

      i++;
    }
    if (foundArticle) {
      return article;
    } else {
      return new ContentError('No valid articles in Trending Articles Query');
    }
  }
};

const matchingURLInArticles = (result: Result, articles: Article[]) => {
  if (articles.length <= 0) {
    return false;
  } else {
    return (
      articles.filter(article => article.source === result.webUrl).length > 0
    );
  }
};

export {
  getTrendingArticle,
  processTrendingArticles,
  matchingURLInArticles,
  getAPIURL,
};
