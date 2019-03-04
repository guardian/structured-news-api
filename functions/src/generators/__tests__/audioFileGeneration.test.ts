// Bad response from API
// Fail to write to file due to bad response
// Fail to write to file due to bad filename
// Successfully write to file

import * as fetchMock from 'fetch-mock';
import { generateAudioFile } from '../audioFileGeneration';

const fetch = fetchMock.sandbox();
jest.setMock('node-fetch', fetch);

describe('generateAudioFile ', () => {
  afterEach(_ => {
    fetchMock.done();
  });

  test('should throw ', async () => {
    expect.assertions(1);
    fetchMock.once('*', 200);
    try {
      await generateAudioFile('', '123');
    } catch (e) {
      expect(e.message).toEqual('500 from Text To Speech API');
    }
  });
});
