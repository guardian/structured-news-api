import { OptionContent } from './models/contentModels';
import { region } from 'firebase-functions';
import { getWeekdayAMBriefing } from './contentResponseBuilders/weekdayAMBriefing';
import { isWeekdayAM } from './briefingSlotCheckers';
import * as moment from 'moment';
import { getFallbackBriefing } from './contentResponseBuilders/fallbackBriefing';
import { APIResponse } from './models/responseModels';

const getLatestUpdate = (noAudio: boolean): Promise<OptionContent> => {
  if (isWeekdayAM(moment().utc())) {
    return getWeekdayAMBriefing(noAudio);
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
