import { CapiEditorsPicks } from '../models/capiModels';
import {
  Article,
  ContentError,
  FallbackTopStories,
  OptionContent,
} from '../models/contentModels';
import fetch from 'node-fetch';
import { getFirstSentence } from './extractorUtils';
import { isValidResult } from './resultValidator';

/*
Current rules for uk Top Stories:
Top stories from CAPI based on showing only editors picks
First sentence each story
Uses resultValidator to check if an article should be included in the top stories
*/

const numberOfStoriesNeeded = 4;

const getUkTopStories = (capiKey: string): Promise<OptionContent> => {
  const topStories = `http://content.guardianapis.com/uk?api-key=${capiKey}&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=uk&show-fields=headline,standfirst,body,bodyText&show-tags=series,contributor`;
  return fetch(topStories)
    .then<CapiEditorsPicks>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processUKTopStories(capiResponse);
    })
    .catch(e => {
      console.error(`Unable to get UK Top Stories. Error: ${e}`);
      return new ContentError('Could not get UK Top Stories');
    });
};

const processUKTopStories = (capiResponse: CapiEditorsPicks): OptionContent => {
  const articles = capiResponse.response.editorsPicks;
  const topStories: Article[] = [];
  let i = 0;
  while (i < articles.length && topStories.length < numberOfStoriesNeeded) {
    const article = articles[i];
    if (isValidResult(article)) {
      topStories.push(
        new Article(
          article.fields.headline,
          getFirstSentence(article.fields.bodyText),
          article.webUrl
        )
      );
    }
    i++;
  }
  if (topStories.length === numberOfStoriesNeeded) {
    return new FallbackTopStories(
      topStories[0],
      topStories[1],
      topStories[2],
      topStories[3]
    );
  } else {
    return new ContentError('Could not get UK top stories');
  }
};

export { getUkTopStories, processUKTopStories };
