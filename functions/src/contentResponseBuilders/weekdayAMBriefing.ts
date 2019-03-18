import fetch from 'node-fetch';
import {
  OptionContent,
  TopStories,
  Article,
  WeekdayAMBriefing,
} from '../models/contentModels';
import { CapiResults, Result } from '../models/capiModels';
import { getDateFromString } from './builderUtils';
import { getTodayInFocus } from '../contentExtractors/todayInFocus';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import { getTopStoriesFromMorningBriefing } from '../contentExtractors/morningBriefingTopStories';
import { generateWeekdayAMSSML } from '../generators/nastySSMLGeneration/weekdayAMSSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { config } from 'firebase-functions';
import * as moment from 'moment';
import {
  APIResponse,
  SuccessAPIResponse,
  FailAPIResponse,
} from '../models/responseModels';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getWeekdayAMBriefing = (noAudio: boolean): Promise<APIResponse> => {
  const dateToday = moment.utc().format('YYYY-MM-DD');
  const morningBriefingURL = `https://content.guardianapis.com/world/series/guardian-morning-briefing?api-key=${capiKey}&from-date=${dateToday}&to-date=${dateToday}&page-size=1&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all`;
  return fetch(morningBriefingURL)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then<APIResponse>(capiResponse => {
      const results = capiResponse.response.results;
      if (results.length > 0) {
        return processResult(results[0], noAudio);
      } else {
        return new FailAPIResponse('Could not get weekday AM update');
      }
    });
};

const processResult = (
  result: Result,
  noAudio: boolean
): Promise<APIResponse> => {
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
): Promise<APIResponse> => {
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
    const briefingContent = [
      weekdayAMBriefing.topStories.story1,
      weekdayAMBriefing.topStories.story2,
      weekdayAMBriefing.topStories.story3,
      weekdayAMBriefing.todayInFocus,
      weekdayAMBriefing.trendingArticle,
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
      new FailAPIResponse('Could not get Weekday AM briefing')
    );
  }
};

export { getWeekdayAMBriefing };
