import { Article, ContentError } from '../models/contentModels';

import { CapiTrending } from '../models/capiModels';
import fetch from 'node-fetch';
import {
  getFirstSentence,
  isMorningBriefing,
  hasBodyText,
} from './extractorUtils';

/*
Current rules for trendingArticles:
The top story from /UK most viewed according to CAPI
First sentence of top story
Story must have the pillarId pillar/news and not be a live blog or have the morning briefing tag.
*/

const getTrendingArticle = (
  capiKey: string
): Promise<Article | ContentError> => {
  const trendingArticles = `http://content.guardianapis.com/uk?api-key=${capiKey}&page-size=10&show-most-viewed=true&show-fields=headline,standfirst,body,bodyText&show-tags=series`;
  return fetch(trendingArticles)
    .then<CapiTrending>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processTrendingArticles(capiResponse);
    })
    .catch(e => {
      console.error(`Unable to get Trending Articles. Error: ${e}`);
      return new ContentError('Could not get Trending Articles');
    });
};

const processTrendingArticles = (
  results: CapiTrending
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
        currentArticle.type !== 'liveblog' &&
        currentArticle.pillarId === 'pillar/news' &&
        !isMorningBriefing(currentArticle) &&
        hasBodyText(currentArticle)
      ) {
        const fields = articles[i].fields;
        article = new Article(
          fields.headline,
          getFirstSentence(fields.bodyText),
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

export { getTrendingArticle, processTrendingArticles };
