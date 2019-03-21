import { getUkTopArticles } from '../contentExtractors/ukTopArticles';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  CapiTopArticles,
  FallbackBriefing,
} from '../models/contentModels';
import {
  SuccessAPIResponse,
  FailAPIResponse,
  APIResponse,
} from '../models/responseModels';
import { generateFallbackSSML } from '../generators/nastySSMLGeneration/fallbackSSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getFallbackBriefing = (noAudio: boolean): Promise<APIResponse> => {
  return getUkTopArticles(capiKey).then(topArticles => {
    return getTrendingArticle(
      capiKey,
      transformTopArticlesForDuplicationTest(topArticles)
    ).then(trendingArticle => {
      return buildResponse(noAudio, topArticles, trendingArticle);
    });
  });
};

const transformTopArticlesForDuplicationTest = (topArticles: OptionContent) => {
  if (topArticles instanceof CapiTopArticles) {
    return [
      topArticles.article1,
      topArticles.article2,
      topArticles.article3,
      topArticles.article4,
    ];
  } else {
    return [];
  }
};

const buildResponse = (
  noAudio: boolean,
  topArticles: OptionContent,
  trendingArticle: OptionContent
): Promise<APIResponse> => {
  if (
    topArticles instanceof CapiTopArticles &&
    trendingArticle instanceof Article
  ) {
    const fallbackBriefing = new FallbackBriefing(topArticles, trendingArticle);
    const ssml = generateFallbackSSML(fallbackBriefing);
    const briefingContent = [
      fallbackBriefing.topArticles.article1,
      fallbackBriefing.topArticles.article2,
      fallbackBriefing.topArticles.article3,
      fallbackBriefing.trendingArticle,
      fallbackBriefing.topArticles.article4,
    ];
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
