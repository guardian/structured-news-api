import { generateAudioFile } from "../generators/audioFileGeneration";
import * as nock from 'nock';

describe('audioFileGeneration', () => {
    describe('generateAudioFile', async () => {
        const apiKey = 'apiKey';
        it('should throw if the server returns a non-2XX response', async () => {
            expect.assertions(1);
            // Usually it's nock(host).post(path), so I've hardcoded this for now
            // given that getGoogleTextToSpeechUrl returns the entire url :)
            nock('https://texttospeech.googleapis.com').post('/v1/text:synthesize?key=apiKey').reply(500);
            try {
                await generateAudioFile('ssml', apiKey);
            } catch(e) {
                expect(e.message).toContain('500');
            }
        });
    });
});