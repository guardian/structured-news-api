import fetch from 'node-fetch';
import {
  OptionContent,
  ContentError,
  MorningBriefing,
  TopStories,
  Article,
  WeekdayAMResponse,
} from '../models/contentModels';
import { CapiResults, Result } from '../models/capiModels';
import { getDateFromString } from './builderUtils';
import { getTodayInFocus } from '../contentExtractors/todayInFocus';
import { getTrendingArticle } from '../contentExtractors/trendingArticle';
import { getTopStories } from '../contentExtractors/morningBriefingTopStories';
import { generateSSML } from '../generators/nastySSMLGeneration';
import { generateAudioFile } from '../generators/audioFileGeneration';
import { config } from 'firebase-functions';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getWeekdayAMBriefing = (noAudio: boolean) => {
  const pageSize = 1;
  const morningBriefing = getMorningBriefingUrl(pageSize);

  return fetch(morningBriefing)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then<OptionContent>(capiResponse => {
      const results = capiResponse.response.results;
      if (results.length > 0) {
        return processResult(results[0], noAudio);
      } else {
        return new ContentError('Could not get daily update');
      }
    });
};

const getMorningBriefingUrl = (pageSize: number) => {
  return `https://content.guardianapis.com/world/series/guardian-morning-briefing?api-key=${capiKey}&page-size=${pageSize}&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all`;
};

const processResult = (
  result: Result,
  noAudio: boolean
): Promise<WeekdayAMResponse> => {
  const articleDate = getDateFromString(result.webPublicationDate);
  return getTodayInFocus(articleDate, capiKey).then(todayInFocus => {
    return getTrendingArticle(capiKey).then(trendingArticle => {
      return buildResponse(
        noAudio,
        articleDate,
        getTopStories(result),
        todayInFocus,
        trendingArticle
      );
    });
  });
};

const buildResponse = (
  noAudio: boolean,
  articleDate: string,
  topStories: OptionContent,
  todayInFocus: OptionContent,
  trendingArticle: OptionContent
): Promise<WeekdayAMResponse> => {
  const morningBriefing = buildMorningBriefing(
    topStories,
    todayInFocus,
    trendingArticle
  );
  const ssml = generateSSML(morningBriefing);
  if (noAudio) {
    return Promise.resolve(
      new WeekdayAMResponse(articleDate, morningBriefing, ssml, '')
    );
  } else {
    return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
      return new WeekdayAMResponse(articleDate, morningBriefing, ssml, url);
    });
  }
};

const buildMorningBriefing = (
  topStories: OptionContent,
  todayInFocus: OptionContent,
  trendingArticle: OptionContent
) => {
  const response = new MorningBriefing();
  if (topStories instanceof TopStories) {
    response.topStories = topStories;
  }
  if (todayInFocus instanceof Article) {
    response.todayInFocus = todayInFocus;
  }
  if (trendingArticle instanceof Article) {
    response.trendingArticle = trendingArticle;
  }
  return response;
};

export { getWeekdayAMBriefing };
