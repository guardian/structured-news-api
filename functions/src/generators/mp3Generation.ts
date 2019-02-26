import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { GoogleTextToSpeechResponse } from '../models/googleModels';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'gu-briefing-audio';
const filename = '/tmp/briefing.mp3';

const getMP3 = (ssml: string, apiKey: string): Promise<void> => {
  return fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: '0.00',
          speakingRate: '1.00',
        },
        input: {
          ssml,
        },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Standard-B',
        },
      }),
    }
  )
    .then<GoogleTextToSpeechResponse>(res => {
      return res.json();
    })
    .then(textToSpeechResponse => {
      const writeStream = fs.createWriteStream(filename);
      writeStream.write(textToSpeechResponse.audioContent, 'base64');
      writeStream.end();
      writeStream.on('finish', () => {
        storage
          .bucket(bucketName)
          .upload(filename, { public: true })
          .then(_ => {
            fs.unlinkSync(filename);
          })
          .catch(e => {
            console.error(`Could not upload file to Google Cloud. Error: ${e}`);
          });
      });
    });
};

export { getMP3 };
