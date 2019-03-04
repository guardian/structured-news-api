import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { GoogleTextToSpeechResponse } from '../models/googleModels';
import { Storage } from '@google-cloud/storage';

const googleCloudStorage = new Storage();
const bucketName = 'gu-briefing-audio';
const defaultFilename = 'briefing.ogg';
const writeDirectory = `/tmp/`;

const generateAudioFile = async (
  ssml: string,
  apiKey: string,
  filename: string = defaultFilename
): Promise<string> => {
  const res = await fetch(getGoogleTextToSpeechUrl(apiKey), {
    method: 'POST',
    body: JSON.stringify(getTextToSpeechBodyRequest(ssml)),
  })
    
  if (res.status >= 400) {
    throw new Error(`${res.status} from Text To Speech API`);
  }

  const textToSpeechResponse: GoogleTextToSpeechResponse = await res.json();
  try {
    return writeStreamToFileAndUploadToGoogleCloudStorage(
      textToSpeechResponse,
      filename
    );
  } catch(e) {
    console.error(
      `Failed to get data from Google Text To Speech service. Error: ${e}`
    );
    throw e;
  }
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
        .upload(fileLocation, { public: true })
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

const getTextToSpeechBodyRequest = (ssml: string) => {
  return {
    audioConfig: {
      audioEncoding: 'OGG_OPUS',
      pitch: '0.00',
      speakingRate: '1.00',
    },
    input: {
      ssml,
    },
    voice: {
      languageCode: 'en-GB',
      name: 'en-GB-Wavenet-A',
    },
  };
};

export { generateAudioFile };
