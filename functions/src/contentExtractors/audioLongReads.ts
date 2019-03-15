import {
  Article,
  ContentError,
  AudioLongReads,
  Podcast,
} from '../models/contentModels';

import { CapiResults, Result } from '../models/capiModels';
import fetch from 'node-fetch';

/*
Current Audio Long Read rules:
Headline and first 2 sentences of standfirst.
*/

const getAudioLongReads = (
  capiKey: string
): Promise<AudioLongReads | ContentError> => {
  const audioLongReads = `https://content.guardianapis.com/news/series/the-audio-long-read?api-key=${capiKey}&show-fields=headline,standfirst,body,trailText&order-by=newest&show-blocks=all`;
  return fetch(audioLongReads)
    .then<CapiResults>(res => {
      return res.json();
    })
    .then(capiResponse => {
      return processAudioLongReads(capiResponse);
    })
    .catch(e => {
      console.error(`Unable to get Audio Long Reads. Error: ${e}`);
      return new ContentError('Could not get Audio Long Reads');
    });
};

const processAudioLongReads = (
  results: CapiResults
): AudioLongReads | ContentError => {
  if (results.response.results.length < 2) {
    console.error('Could not get audio long reads');
    return new ContentError('No matches found for Audio Long Reads Query');
  } else {
    const latest = results.response.results[0];
    const older = results.response.results[1];
    return new AudioLongReads(
      processAudioLongRead(latest),
      processAudioLongRead(older)
    );
  }
};

const processAudioLongRead = (result: Result) => {
  return new Article(
    result.fields.headline,
    result.fields.trailText,
    result.webUrl,
    Podcast.LONGREAD
  );
};

export { getAudioLongReads };
