import { region } from 'firebase-functions';
import { getWeekdayAMBriefing } from './contentResponseBuilders/weekdayAMBriefing';
import { getFallbackBriefing } from './contentResponseBuilders/fallbackBriefing';
import { getWeekendBriefing } from './contentResponseBuilders/weekendBriefing';
import {
  APIResponse,
  FailAPIResponse,
  SuccessAPIResponse,
} from './models/responseModels';
import { getBooleanParam, getLocaleParam } from './paramsHelpers';
import { Locale } from './models/paramModels';
import { BriefingTemplate } from './models/contentModels';
import { getBriefingVersion } from './contentResponseBuilders/briefingVersions';

const getLatestUpdate = (
  noAudio: boolean,
  locale: Locale
): Promise<APIResponse> => {
  const version = getBriefingVersion(locale);

  const getBriefing = () => {
    switch (version) {
      case BriefingTemplate.GBWEEKDAYAM:
        return getWeekdayAMBriefing(noAudio);
      case BriefingTemplate.GBSATURDAY:
        return getWeekendBriefing(noAudio, true);
      case BriefingTemplate.GBSUNDAY:
        return getWeekendBriefing(noAudio, false);
      case BriefingTemplate.GBFALLBACK:
        return getFallbackBriefing(noAudio, locale);
      case BriefingTemplate.AUFALLBACK:
        return getFallbackBriefing(noAudio, locale);
      case BriefingTemplate.USFALLBACK:
        return getFallbackBriefing(noAudio, locale);
    }
  };

  const briefing = getBriefing();
  return briefing instanceof FailAPIResponse
    ? getFallbackBriefing(noAudio, Locale.GB)
    : briefing;
};

exports.structuredNewsApi = region('europe-west1').https.onRequest(
  (request, response) => {
    const noAudio: boolean = getBooleanParam(request.query.noAudio);
    const locale: Locale = getLocaleParam(request.query.locale);
    getLatestUpdate(noAudio, locale)
      .then(latestUpdate => {
        if (latestUpdate instanceof SuccessAPIResponse) {
          response.send(latestUpdate);
        } else {
          console.error(
            `No content available in response from Guardian Content API. Error: ${latestUpdate}`
          );
          response
            .status(500)
            .send(`500: Could not get data. No content available`);
        }
      })
      .catch(e => {
        console.error(`Failed to get data. Error: ${e}`);
        response.status(500).send('500: Could not get data');
      });
  }
);
