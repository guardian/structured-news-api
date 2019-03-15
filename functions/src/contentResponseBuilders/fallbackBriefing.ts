import { getUkTopStories } from '../contentExtractors/ukTopStories';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  FallbackTopStories,
  FallbackBriefing,
} from '../models/contentModels';
import {
  BriefingContent,
  SuccessAPIResponse,
  FailAPIResponse,
  APIResponse,
} from '../models/responseModels';
import { generateFallbackSSML } from '../generators/nastySSMLGeneration/fallbackSSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getFallbackBriefing = (noAudio: boolean): Promise<APIResponse> => {
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
): Promise<APIResponse> => {
  if (
    topStories instanceof FallbackTopStories &&
    trendingArticle instanceof Article
  ) {
    const fallbackBriefing = new FallbackBriefing(topStories, trendingArticle);
    const ssml = generateFallbackSSML(fallbackBriefing);
    const briefingContent = new BriefingContent(
      fallbackBriefing.topStories.story1,
      fallbackBriefing.topStories.story2,
      fallbackBriefing.topStories.story3,
      fallbackBriefing.trendingArticle,
      fallbackBriefing.topStories.story4
    );
    if (noAudio) {
      return Promise.resolve(new SuccessAPIResponse(briefingContent, ssml, ''));
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
        return new SuccessAPIResponse(briefingContent, ssml, url);
      });
    }
  } else {
    return Promise.resolve(
      new FailAPIResponse('Could not get content for fallback.')
    );
  }
};

export { getFallbackBriefing };
