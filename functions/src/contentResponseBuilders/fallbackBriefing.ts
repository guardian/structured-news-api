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
import { generateFallbackSSML } from '../generators/nastySSMLGeneration/fallbackSSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getFallbackBriefing = (noAudio: boolean) => {
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
): Promise<OptionContent> => {
  if (
    topStories instanceof FallbackTopStories &&
    trendingArticle instanceof Article
  ) {
    const fallbackBriefing = new FallbackBriefing(topStories, trendingArticle);
    const ssml = generateFallbackSSML(fallbackBriefing);
    if (noAudio) {
      return Promise.resolve(new FallbackResponse(fallbackBriefing, ssml, ''));
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
        return new FallbackResponse(fallbackBriefing, ssml, url);
      });
    }
  } else {
    return Promise.resolve(
      new ContentError('Could not get content for fallback.')
    );
  }
};

export { getFallbackBriefing };
