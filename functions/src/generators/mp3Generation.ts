import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { GoogleTextToSpeechResponse } from '../models/googleModels';

const getMP3 = (ssml: string, apiKey: string) => {
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
      const writeStream = fs.createWriteStream('output.mp3');
      writeStream.write(textToSpeechResponse.audioContent, 'base64');
      writeStream.end();
    });
};

export { getMP3 };
