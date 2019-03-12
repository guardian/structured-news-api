import { getUkTopStories } from '../contentExtractors/ukTopStories';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  FallbackTopStories,
  ContentError,
} from '../models/contentModels';
import { FallbackResponse, FallbackBriefing } from '../models/responseModels';
const capiKey = config().guardian.capikey;

const getFallbackBriefing = (noAudio: boolean): Promise<OptionContent> => {
  return getUkTopStories(capiKey).then(topStories => {
    return getTrendingArticle(capiKey).then(trendingArticle => {
      return buildResponse(noAudio, topStories, trendingArticle);
    });
  });
};

const buildResponse = (
  noAudio: boolean,
  topStories: OptionContent,
  trendingArticle: OptionContent
): OptionContent => {
  if (
    topStories instanceof FallbackTopStories &&
    trendingArticle instanceof Article
  ) {
    return new FallbackResponse(
      new FallbackBriefing(topStories, trendingArticle),
      '',
      ''
    );
  } else {
    return new ContentError('Could not get content for fallback.');
  }
};

export { getFallbackBriefing };
