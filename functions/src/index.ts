import {
  APIResponse,
  Article,
  MorningBriefing,
  OptionContent,
  TopStories,
  ContentError,
} from './models/contentModels';
import { config, region } from 'firebase-functions';

import { CapiResults, Result } from './models/capiModels';
import fetch from 'node-fetch';
import { generateSSML } from './generators/nastySSMLGeneration';
import { getDateFromString } from './utils';
import { getTodayInFocus } from './contentExtractors/todayInFocus';
import { getTopStories } from './contentExtractors/morningBriefingTopStories';
import { generateAudioFile } from './generators/audioFileGeneration';
import { getTrendingArticle } from './contentExtractors/trendingArticles';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getMorningBriefingUrl = (pageSize: number) => {
  return `https://content.guardianapis.com/world/series/guardian-morning-briefing?api-key=${capiKey}&page-size=${pageSize}&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all`;
};

const buildTestData = (): Promise<APIResponse[]> => {
  const pageSize = 50;
  const morningBriefing = getMorningBriefingUrl(pageSize);

  return fetch(morningBriefing)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then(capiResponse => {
      const results = capiResponse.response.results;
      const response = results.map(result => {
        return processResult(result);
      });
      return Promise.all(response);
    });
};

const processResult = (result: Result): Promise<APIResponse> => {
  const articleDate = getDateFromString(result.webPublicationDate);
  return getTodayInFocus(articleDate, capiKey).then(todayInFocus => {
    return getTrendingArticle(capiKey).then(trendingArticle => {
      return buildResponse(
        articleDate,
        getTopStories(result),
        todayInFocus,
        trendingArticle
      );
    });
  });
};

const getDailyUpdate = () => {
  const pageSize = 1;
  const morningBriefing = getMorningBriefingUrl(pageSize);

  return fetch(morningBriefing)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then<OptionContent>(capiResponse => {
      const results = capiResponse.response.results;
      if (results.length > 0) {
        return processResult(results[0]);
      } else {
        return new ContentError('Could not get daily update');
      }
    });
};

const buildResponse = (
  articleDate: string,
  topStories: OptionContent,
  todayInFocus: OptionContent,
  trendingArticle: OptionContent
): Promise<APIResponse> => {
  const morningBriefing = buildMorningBriefing(
    topStories,
    todayInFocus,
    trendingArticle
  );
  const ssml = generateSSML(morningBriefing);
  return generateAudioFile(ssml, googleTextToSpeechKey).then(url => {
    return new APIResponse(articleDate, morningBriefing, ssml, url);
  });
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

exports.structuredNewsApi = region('europe-west1').https.onRequest(
  (request, response) => {
    const isTest: boolean = request.query.isTest;
    if (isTest) {
      buildTestData()
        .then(testData => {
          response.send(testData);
        })
        .catch(e => {
          console.error(`Failed to get daily update test data. Error: ${e}`);
          response.status(500).send('500: Could not get test data');
        });
    } else {
      getDailyUpdate()
        .then(dailyUpdate => {
          if (dailyUpdate instanceof APIResponse) {
            response.send(dailyUpdate);
          } else {
            console.error(
              `No content available in response from Guardian Content API. Error: ${dailyUpdate}`
            );
            response
              .status(500)
              .send('500: Could not get daily update. No content available');
          }
        })
        .catch(e => {
          console.error(`Failed to get daily update. Error: ${e}`);
          response.status(500).send('500: Could not get daily update');
        });
    }
  }
);
