import { OptionContent, ContentError } from './models/contentModels';
import { region } from 'firebase-functions';
import { getWeekdayAMBriefing } from './contentResponseBuilders/weekdayAMBriefing';
import { isWeekdayAM, isSaturday, isSunday } from './briefingSlotCheckers';
import * as moment from 'moment';
import { getFallbackBriefing } from './contentResponseBuilders/fallbackBriefing';
import { APIResponse } from './models/responseModels';
import { getWeekendBriefing } from './contentResponseBuilders/weekendBriefing';

const getLatestUpdate = (noAudio: boolean): Promise<OptionContent> => {
  const currentTime = moment().utc();
  if (isWeekdayAM(currentTime)) {
    const amBriefing = getWeekdayAMBriefing(noAudio);
    return amBriefing instanceof ContentError
      ? getFallbackBriefing(noAudio)
      : amBriefing;
  }
  if (isSaturday(currentTime)) {
    const saturdayBriefing = getWeekendBriefing(noAudio, true);
    return saturdayBriefing instanceof ContentError
      ? getFallbackBriefing(noAudio)
      : saturdayBriefing;
  }
  if (isSunday(currentTime)) {
    const sundayBriefing = getWeekendBriefing(noAudio, false);
    return sundayBriefing instanceof ContentError
      ? getFallbackBriefing(noAudio)
      : sundayBriefing;
  } else {
    return getFallbackBriefing(noAudio);
  }
};

const getBooleanParam = (param: any): boolean => {
  if (typeof param === 'string') {
    return param.toLowerCase() === 'true' ? true : false;
  } else {
    return false;
  }
};

exports.structuredNewsApi = region('europe-west1').https.onRequest(
  (request, response) => {
    const noAudio: boolean = getBooleanParam(request.query.noAudio);
    getLatestUpdate(noAudio)
      .then(latestUpdate => {
        if (latestUpdate instanceof APIResponse) {
          response.send(latestUpdate);
        } else {
          console.error(
            `No content available in response from Guardian Content API. Error: ${latestUpdate}`
          );
          response
            .status(500)
            .send('500: Could not get data. No content available');
        }
      })
      .catch(e => {
        console.error(`Failed to get data. Error: ${e}`);
        response.status(500).send('500: Could not get data');
      });
  }
);
