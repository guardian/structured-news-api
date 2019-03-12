import fetch from 'node-fetch';
import {
  OptionContent,
  ContentError,
  TopStories,
  Article,
} from '../models/contentModels';
import { CapiResults, Result } from '../models/capiModels';
import { getDateFromString } from './builderUtils';
import { getTodayInFocus } from '../contentExtractors/todayInFocus';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import { getTopStoriesFromMorningBriefing } from '../contentExtractors/morningBriefingTopStories';
import { generateWeekdayAMSSML } from '../generators/nastySSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { config } from 'firebase-functions';
import { WeekdayAMBriefing, WeekdayAMResponse } from '../models/responseModels';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getWeekdayAMBriefing = (noAudio: boolean) => {
  const morningBriefingURL = `https://content.guardianapis.com/world/series/guardian-morning-briefing?api-key=${capiKey}&page-size=1&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all`;

  return fetch(morningBriefingURL)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then<OptionContent>(capiResponse => {
      const results = capiResponse.response.results;
      if (results.length > 0) {
        return processResult(results[0], noAudio);
      } else {
        return new ContentError('Could not get weekday AM update');
      }
    });
};

const processResult = (
  result: Result,
  noAudio: boolean
): Promise<OptionContent> => {
  const articleDate = getDateFromString(result.webPublicationDate);
  return getTodayInFocus(articleDate, capiKey).then(todayInFocus => {
    return getTrendingArticle(capiKey).then(trendingArticle => {
      return buildResponse(
        noAudio,
        getTopStoriesFromMorningBriefing(result),
        todayInFocus,
        trendingArticle
      );
    });
  });
};

const buildResponse = (
  noAudio: boolean,
  topStories: OptionContent,
  todayInFocus: OptionContent,
  trendingArticle: OptionContent
): Promise<OptionContent> => {
  if (
    topStories instanceof TopStories &&
    todayInFocus instanceof Article &&
    trendingArticle instanceof Article
  ) {
    const weekdayAMBriefing = new WeekdayAMBriefing(
      topStories,
      todayInFocus,
      trendingArticle
    );
    const ssml = generateWeekdayAMSSML(weekdayAMBriefing);
    if (noAudio) {
      return Promise.resolve(
        new WeekdayAMResponse(weekdayAMBriefing, ssml, '')
      );
    } else {
      return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
        return new WeekdayAMResponse(weekdayAMBriefing, ssml, url);
      });
    }
  } else {
    return Promise.resolve(
      new ContentError('Could not get Weekday AM briefing')
    );
  }
};

export { getWeekdayAMBriefing };
