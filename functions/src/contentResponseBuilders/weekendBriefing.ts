import { getUkTopArticles } from '../contentExtractors/ukTopArticles';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  CapiTopArticles,
  AudioLongReads,
  WeekendBriefing,
} from '../models/contentModels';
import {
  SuccessAPIResponse,
  FailAPIResponse,
  APIResponse,
} from '../models/responseModels';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { getAudioLongReads } from '../contentExtractors/audioLongReads';
import { generateSaturdaySSML } from '../generators/nastySSMLGeneration/saturdaySSMLGeneration';
import { generateSundaySSML } from '../generators/nastySSMLGeneration/sundaySSMLGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getWeekendBriefing = (
  noAudio: boolean,
  isSaturday: boolean
): Promise<APIResponse> => {
  return getUkTopArticles(capiKey).then(topArticles => {
    return getAudioLongReads(capiKey).then(longReads => {
      return getTrendingArticle(
        capiKey,
        transformTopArticlesForDuplicationTest(topArticles)
      ).then(trendingArticle => {
        return buildResponse(
          noAudio,
          isSaturday,
          topArticles,
          longReads,
          trendingArticle
        );
      });
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
  isSaturday: boolean,
  topArticles: OptionContent,
  audioLongReads: OptionContent,
  trendingArticle: OptionContent
): Promise<APIResponse> => {
  if (
    topArticles instanceof CapiTopArticles &&
    audioLongReads instanceof AudioLongReads &&
    trendingArticle instanceof Article
  ) {
    const longRead = isSaturday
      ? audioLongReads.olderLongRead
      : audioLongReads.latestLongRead;

    const weekendBriefing = new WeekendBriefing(
      topArticles,
      longRead,
      trendingArticle
    );
    const ssml = isSaturday
      ? generateSaturdaySSML(weekendBriefing)
      : generateSundaySSML(weekendBriefing);
    const briefingContent = [
      weekendBriefing.topArticles.article1,
      weekendBriefing.topArticles.article2,
      weekendBriefing.topArticles.article3,
      weekendBriefing.audioLongRead,
      weekendBriefing.trendingArticle,
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
      new FailAPIResponse(
        `Could not get content for ${
          isSaturday ? 'Saturday' : 'Sunday'
        } Briefing.`
      )
    );
  }
};

export { getWeekendBriefing };
