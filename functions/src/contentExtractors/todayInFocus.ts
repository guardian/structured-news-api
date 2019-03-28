import { Article, ContentError, Podcast } from '../models/contentModels';

import { CapiResults } from '../models/capiModels';
import fetch from 'node-fetch';
import { stripHTMLTags } from './extractorUtils';

/*
Current Today in Focus rules:
Headline and first 2 sentences of standfirst.
*/

const getTodayInFocus = (
  date: string,
  capiKey: string
): Promise<Article | ContentError> => {
  const todayInFocus = `https://content.guardianapis.com/news/series/todayinfocus?api-key=${capiKey}&page-size=1&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all&from-date=${date}&to-date=${date}`;
  return fetch(todayInFocus)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processTodayInFocus(capiResponse);
    })
    .catch(e => {
      console.error(
        `Unable to get Today in Focus for date: ${date}. Error: ${e}`
      );
      return new ContentError('Could not get today in focus');
    });
};

const processTodayInFocus = (results: CapiResults): Article | ContentError => {
  if (results.response.results.length < 1) {
    console.error('No matches for Today in Focus query');
    return new ContentError('No matches found for Today in Focus Query');
  } else {
    const article = results.response.results[0];
    return new Article(
      article.fields.headline,
      getTodayInFocusStandfirst(stripHTMLTags(article.fields.standfirst)),
      article.webUrl,
      article.tags,
      Podcast.TODAYINFOCUS
    );
  }
};

const getTodayInFocusStandfirst = (standfirst: string): string => {
  const sentences = standfirst.split('.');
  if (sentences.length > 1) {
    return `${sentences[0]}. ${sentences[1]}.`;
  } else {
    return standfirst;
  }
};

export { getTodayInFocus, processTodayInFocus };
