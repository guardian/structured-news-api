import { APIResponse, OptionContent } from './models/contentModels';
import { region } from 'firebase-functions';
import { getWeekdayAMBriefing } from './contentResponseBuilders/weekdayAMBriefing';

const getLatestUpdate = (noAudio: boolean): Promise<OptionContent> => {
  return getWeekdayAMBriefing(noAudio);
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
            .send('500: Could not get daily update. No content available');
        }
      })
      .catch(e => {
        console.error(`Failed to get daily update. Error: ${e}`);
        response.status(500).send('500: Could not get daily update');
      });
  }
  // }
);
