import { CapiEditorsPicks } from '../models/capiModels';
import {
  Article,
  ContentError,
  FallbackTopStories,
  OptionContent,
} from '../models/contentModels';
import fetch from 'node-fetch';
import {
  isMorningBriefing,
  getFirstSentence,
  hasBodyText,
} from './extractorUtils';

/*
Current rules for uk Top Stories:
Top stories from CAPI based on showing only editors picks
First sentence each story
Story must have the pillarId pillar/news and have the article type 'article' or have the morning briefing tag.
*/

const numberOfStoriesNeeded = 4;

const getUkTopStories = (capiKey: string): Promise<OptionContent> => {
  const topStories = `http://content.guardianapis.com/uk?api-key=${capiKey}&page-size=10&show-editors-picks=true&only-editors-picks=true&show-most-viewed=false&edition=uk&show-fields=headline,standfirst,body,bodyText&show-tags=series`;
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
    if (
      article.type === 'article' &&
      article.pillarId === 'pillar/news' &&
      !isMorningBriefing(article) &&
      hasBodyText(article)
    ) {
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
