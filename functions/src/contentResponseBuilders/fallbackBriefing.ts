import { getTopArticles } from '../contentExtractors/topArticles';
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
import { generateUKFallbackSSML } from '../generators/nastySSMLGeneration/ukFallbackSSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { Locale } from '../models/paramModels';
import { generateAUFallbackSSML } from '../generators/nastySSMLGeneration/auFallbackSSMLGeneration';
import { generateUSFallbackSSML } from '../generators/nastySSMLGeneration/usFallbackSSMLGeneration.1';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getFallbackBriefing = (
  noAudio: boolean,
  locale: Locale
): Promise<APIResponse> => {
  return getTopArticles(capiKey, locale).then(topArticles => {
    return getTrendingArticle(
      capiKey,
      transformTopArticlesForDuplicationTest(topArticles),
      locale
    ).then(trendingArticle => {
      return buildResponse(noAudio, topArticles, trendingArticle, locale);
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
  trendingArticle: OptionContent,
  locale: Locale
): Promise<APIResponse> => {
  if (
    topArticles instanceof CapiTopArticles &&
    trendingArticle instanceof Article
  ) {
    const fallbackBriefing = new FallbackBriefing(topArticles, trendingArticle);
    const ssml = buildSSML(fallbackBriefing, locale);
    const briefingContent = [
      fallbackBriefing.topArticles.article1,
      fallbackBriefing.topArticles.article2,
      fallbackBriefing.topArticles.article3,
      fallbackBriefing.trendingArticle,
      fallbackBriefing.topArticles.article4,
    ];
    if (noAudio) {
      return Promise.resolve(
        new SuccessAPIResponse(briefingContent, [ssml], [''])
      );
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey, locale).then(
        url => {
          return new SuccessAPIResponse(briefingContent, [ssml], [url]);
        }
      );
    }
  } else {
    return Promise.resolve(
      new FailAPIResponse('Could not get content for fallback.')
    );
  }
};

const buildSSML = (briefing: FallbackBriefing, locale: Locale) => {
  switch (locale) {
    case Locale.GB:
      return generateUKFallbackSSML(briefing);
    case Locale.AU:
      return generateAUFallbackSSML(briefing);
    case Locale.US:
      return generateUSFallbackSSML(briefing);
  }
};

export { getFallbackBriefing };
