import { getUkTopStories } from '../contentExtractors/ukTopStories';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  FallbackTopStories,
  ContentError,
  AudioLongReads,
} from '../models/contentModels';
import { FallbackResponse, WeekendBriefing } from '../models/responseModels';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { getAudioLongReads } from '../contentExtractors/audioLongReads';
import { generateSaturdaySSML } from '../generators/nastySSMLGeneration/saturdaySSMLGeneration';
import { generateSundaySSML } from '../generators/nastySSMLGeneration/sundaySSMLGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getWeekendBriefing = (noAudio: boolean, isSaturday: boolean) => {
  return getUkTopStories(capiKey).then(topStories => {
    return getAudioLongReads(capiKey).then(longReads => {
      return getTrendingArticle(capiKey).then(trendingArticle => {
        return buildResponse(
          noAudio,
          isSaturday,
          topStories,
          longReads,
          trendingArticle
        );
      });
    });
  });
};

const buildResponse = (
  noAudio: boolean,
  isSaturday: boolean,
  topStories: OptionContent,
  audioLongReads: OptionContent,
  trendingArticle: OptionContent
): Promise<OptionContent> => {
  if (
    topStories instanceof FallbackTopStories &&
    audioLongReads instanceof AudioLongReads &&
    trendingArticle instanceof Article
  ) {
    const longRead = isSaturday
      ? audioLongReads.olderLongRead
      : audioLongReads.latestLongRead;

    const weekendBriefing = new WeekendBriefing(
      topStories,
      longRead,
      trendingArticle
    );
    const ssml = isSaturday
      ? generateSaturdaySSML(weekendBriefing)
      : generateSundaySSML(weekendBriefing);
    if (noAudio) {
      return Promise.resolve(new FallbackResponse(weekendBriefing, ssml, ''));
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
        return new FallbackResponse(weekendBriefing, ssml, url);
      });
    }
  } else {
    return Promise.resolve(
      new ContentError('Could not get content for Saturday Briefing.')
    );
  }
};

export { getWeekendBriefing };
