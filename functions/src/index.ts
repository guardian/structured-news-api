import {
  APIResponse,
  Article,
  MorningBriefing,
  OptionContent,
  TopStories,
} from './models/contentModels';
import { config, region } from 'firebase-functions';

import { CapiResults } from './models/capiModels';
import fetch from 'node-fetch';
import { generateSSML } from './generators/nastySSMLGeneration';
import { getDateFromString } from './utils';
import { getReadingMaterial } from './contentExtractors/morningBriefingReadingMaterial';
import { getTodayInFocus } from './contentExtractors/todayInFocus';
import { getTopStories } from './contentExtractors/morningBriefingTopStories';
import { getMP3 } from './generators/mp3Generation';

const capiKey = config().guardian.capikey;
const googleTextToSpeechKey = config().googletexttospeech.key;

const getDailyUpdate = (isTest: boolean) => {
  const pageSize = isTest ? 50 : 1;
  const morningBriefing = `https://content.guardianapis.com/world/series/guardian-morning-briefing?api-key=${capiKey}&page-size=${pageSize}&show-fields=headline,standfirst,body&order-by=newest&show-blocks=all`;

  return fetch(morningBriefing)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then(capiResponse => {
      const results = capiResponse.response.results;
      const response = results.map(result => {
        const articleDate = getDateFromString(result.webPublicationDate);
        return getTodayInFocus(articleDate, capiKey).then(todayInFocus => {
          return getReadingMaterial(result, capiKey).then(readingMaterial => {
            const r = buildResponse(
              articleDate,
              getTopStories(result),
              todayInFocus,
              readingMaterial
            );
            getMP3(r.ssml, googleTextToSpeechKey);
            return r;
          });
        });
      });
      return Promise.all(response);
    })
    .catch(e => {
      console.error(`Could not get daily update. Error: ${e}`);
      return e;
    });
};

const buildResponse = (
  articleDate: string,
  topStories: OptionContent,
  todayInFocus: OptionContent,
  readingMaterial: OptionContent
): APIResponse => {
  const morningBriefing = buildMorningBriefing(
    topStories,
    todayInFocus,
    readingMaterial
  );
  const ssml = generateSSML(morningBriefing);
  const response = new APIResponse(articleDate, morningBriefing, ssml);

  return response;
};

const buildMorningBriefing = (
  topStories: OptionContent,
  todayInFocus: OptionContent,
  readingMaterial: OptionContent
) => {
  const response = new MorningBriefing();
  if (topStories instanceof TopStories) {
    response.topStories = topStories;
  }
  if (todayInFocus instanceof Article) {
    response.todayInFocus = todayInFocus;
  }
  if (readingMaterial instanceof Article) {
    response.readingMaterial = readingMaterial;
  }
  return response;
};

exports.structuredNewsApi = region('europe-west1').https.onRequest(
  (request, response) => {
    const isTest: boolean = request.query.isTest;
    getDailyUpdate(isTest)
      .then(dailyUpdate => {
        response.send(dailyUpdate);
      })
      .catch(e => {
        console.error(`Failed to get daily update. Error: ${e}`);
        response.status(500).send('500: Could not get daily update');
      });
  }
);
