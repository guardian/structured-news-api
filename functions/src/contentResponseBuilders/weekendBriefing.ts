import { getUkTopStories } from '../contentExtractors/ukTopStories';
import { config } from 'firebase-functions';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import {
  Article,
  OptionContent,
  FallbackTopStories,
  AudioLongReads,
  WeekendBriefing,
} from '../models/contentModels';
import {
  SuccessAPIResponse,
  FailAPIResponse,
  APIResponse,
  BriefingContent,
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
): Promise<APIResponse> => {
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
    const briefingContent = new BriefingContent(
      weekendBriefing.topStories.story1,
      weekendBriefing.topStories.story2,
      weekendBriefing.topStories.story3,
      weekendBriefing.audioLongRead,
      weekendBriefing.trendingArticle
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
      new FailAPIResponse(
        `Could not get content for ${
          isSaturday ? 'Saturday' : 'Sunday'
        } Briefing.`
      )
    );
  }
};

export { getWeekendBriefing };
