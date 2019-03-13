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
import { FallbackResponse, SaturdayBriefing } from '../models/responseModels';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { getAudioLongReads } from '../contentExtractors/audioLongReads';
import { generateSaturdaySSML } from '../generators/nastySSMLGeneration/saturdaySSMLGeneration';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getSaturdayBriefing = (noAudio: boolean) => {
  return getUkTopStories(capiKey).then(topStories => {
    return getAudioLongReads(capiKey).then(longReads => {
      return getTrendingArticle(capiKey).then(trendingArticle => {
        return buildResponse(noAudio, topStories, longReads, trendingArticle);
      });
    });
  });
};

const buildResponse = (
  noAudio: boolean,
  topStories: OptionContent,
  audioLongReads: OptionContent,
  trendingArticle: OptionContent
): Promise<OptionContent> => {
  if (
    topStories instanceof FallbackTopStories &&
    audioLongReads instanceof AudioLongReads &&
    trendingArticle instanceof Article
  ) {
    const saturdayBriefing = new SaturdayBriefing(
      topStories,
      audioLongReads.olderLongRead,
      trendingArticle
    );
    const ssml = generateSaturdaySSML(saturdayBriefing);
    if (noAudio) {
      return Promise.resolve(new FallbackResponse(saturdayBriefing, ssml, ''));
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
        return new FallbackResponse(saturdayBriefing, ssml, url);
      });
    }
  } else {
    return Promise.resolve(
      new ContentError('Could not get content for Saturday Briefing.')
    );
  }
};

export { getSaturdayBriefing };
