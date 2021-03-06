import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { GoogleTextToSpeechResponse } from '../models/googleModels';
import { Storage } from '@google-cloud/storage';
import * as moment from 'moment';
import { Locale } from '../models/paramModels';

const googleCloudStorage = new Storage();
const bucketName = 'gu-briefing-audio';
const writeDirectory = `/tmp/`;

const generateAudioFile = (
  ssml: string,
  apiKey: string,
  locale: Locale = Locale.GB,
  identifier: string = ''
): Promise<string> => {
  const filename = timestampFilename(locale, identifier);
  return fetch(getGoogleTextToSpeechUrl(apiKey), {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(getTextToSpeechBodyRequest(ssml, locale)),
  })
    .then<GoogleTextToSpeechResponse>(res => {
      if (res.status >= 400) {
        throw new Error(`${res.status} from Text To Speech API`);
      } else {
        return res.json();
      }
    })
    .then(textToSpeechResponse => {
      return writeStreamToFileAndUploadToGoogleCloudStorage(
        textToSpeechResponse,
        filename
      );
    })
    .catch(e => {
      console.error(
        `Failed to get data from Google Text To Speech service. Error: ${e}`
      );
      throw e;
    });
};

const writeStreamToFileAndUploadToGoogleCloudStorage = (
  response: GoogleTextToSpeechResponse,
  filename: string
): Promise<string> => {
  const fileLocation = `${writeDirectory}${filename}`;
  return new Promise<string>((resolve, reject) => {
    const writeStream = fs.createWriteStream(fileLocation);
    writeStream.write(response.audioContent, 'base64');
    writeStream.end();
    writeStream.on('finish', () => {
      googleCloudStorage
        .bucket(bucketName)
        .upload(fileLocation, {
          public: true,
          metadata: { cacheControl: 'no-cache' },
        })
        .then(_ => {
          fs.unlinkSync(fileLocation);
          resolve(getAudioAssetUrl(filename));
        })
        .catch(e => {
          console.error(`Could not upload file to Google Cloud. Error: ${e}`);
          reject(e);
        });
    });
    writeStream.on('error', reject);
  });
};

const getAudioAssetUrl = (filename: string) => {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
};

const getGoogleTextToSpeechUrl = (apiKey: string) => {
  return `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
};

const timestampFilename = (locale: Locale, identifier: string): string => {
  const currentUnixTime = moment()
    .utc()
    .unix();
  return `${locale}-briefing${currentUnixTime}-${identifier}.ogg`;
};

const getTextToSpeechBodyRequest = (ssml: string, locale: Locale) => {
  switch (locale) {
    case Locale.GB:
      return {
        audioConfig: {
          audioEncoding: 'OGG_OPUS',
          pitch: '0.00',
          speakingRate: '0.92',
        },
        input: {
          ssml,
        },
        voice: {
          languageCode: 'en-GB',
          name: 'en-GB-Wavenet-B',
        },
      };
    case Locale.AU:
      return {
        audioConfig: {
          audioEncoding: 'OGG_OPUS',
          pitch: '0.00',
          speakingRate: '0.92',
        },
        input: {
          ssml,
        },
        voice: {
          languageCode: 'en-AU',
          name: 'en-AU-Wavenet-B',
        },
      };
    case Locale.US:
      return {
        audioConfig: {
          audioEncoding: 'OGG_OPUS',
          pitch: '0.00',
          speakingRate: '0.92',
        },
        input: {
          ssml,
        },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Wavenet-D',
        },
      };
  }
};

export { generateAudioFile };
