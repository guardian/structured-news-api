import { Article } from '../../models/contentModels';
import { WeekendBriefing } from '../../models/responseModels';
import { stripExcessWhitespace, encodeStringForSSML } from './SSMLUtils';

/*
Very hacky generation of SSML.
*/

const generateSundaySSML = (sundayBriefing: WeekendBriefing) => {
  const topStories = sundayBriefing.topStories;
  const topStoriesSSML = generateTopStories(
    topStories.story1,
    topStories.story2,
    topStories.story3
  );
  const audioLongReadSSML = generateAudioLongRead(
    sundayBriefing.audioLongRead,
    'wordsHD3'
  );
  const trendingArticleSSML = generateTrendingArticle(
    sundayBriefing.trendingArticle,
    'wordsLongRead'
  );

  const outro = generateOutro('wordsTrending');
  return sundayBriefingSSML(
    topStoriesSSML,
    audioLongReadSSML,
    trendingArticleSSML,
    outro
  );
};

const sundayBriefingSSML = (
  topStoriesSSML: string,
  audioLongReadSSML: string,
  trendingArticleSSML: string,
  outro: string
) => {
  const ssml = `
  <speak>
    <par>
      <media xml:id='earcon' soundLevel='-3dB'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Earcon.ogg'/>
      </media>
      <media xml:id='advert' begin='earcon.end-0.8s' soundLevel='-2dB'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Advert.ogg'/>
      </media>
      <media xml:id='intro' begin='advert.end+1.4s'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_Intro%2B6.ogg'/>
      </media>

      ${topStoriesSSML}
      ${audioLongReadSSML}
      ${trendingArticleSSML}
      ${outro}
    </par> 
  </speak>`;
  return stripExcessWhitespace(ssml);
};

const generateTopStories = (
  story1: Article,
  story2: Article,
  story3: Article
) => {
  const ssml = `
    <media xml:id='HL1' begin='intro.end-0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_HL1%2B6.ogg'/>
    </media>

    <media xml:id='wordsHL1' begin='HL1.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story1.standfirst)}
      </speak>
    </media>

    <media xml:id='HL2' begin='wordsHL1.end-0.5s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_HL2%2B6.ogg'/>
    </media>

    <media xml:id='wordsHL2' begin='HL2.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story2.standfirst)}
      </speak>
    </media>

    <media xml:id='HL3' begin='wordsHL2.end-0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_HL3%2B6.ogg'/>
    </media>

    <media xml:id='wordsHD3' begin='HL3.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story3.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateAudioLongRead = (article: Article, previous: string) => {
  const ssml = `
      <media xml:id='LongRead' begin='${previous}.end+0.4s'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_ALR%2B6.ogg'/>
      </media>
  
      <media xml:id='wordsLongRead' begin='LongRead.end+0.0s' soundLevel='-1dB'>
        <speak>
        ${encodeStringForSSML(article.standfirst)}
        </speak>
      </media>`;
  return ssml;
};

const generateTrendingArticle = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='Trending' begin='${previous}.end+0.8s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_Trending%2B6.ogg'/>
    </media>

    <media xml:id='wordsTrending' begin='Trending.end+0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateOutro = (previous: string) => {
  const ssml = `
    <media xml:id='outro' begin='${previous}.end+0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Sunday_Outro%2B6.ogg'/>
    </media>

    <media xml:id='music1' begin='advert.end-0.3s' soundLevel='-1.0dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_Intro_s.ogg'/>
    </media>

    <media xml:id='music2' begin='music1.end+0.0s' end='wordsHD3.end+1.0s' soundLevel='-10.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_1l.ogg'/>
    </media>

    <media xml:id='musicLongRead' begin='music2.end-1.0s' end='wordsLongRead.end+2.0s' soundLevel='-23.0dB' fadeOutDur='2.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Chop_up_first_Magnified_loop_4_hook_long.ogg'/>
    </media>

    <media xml:id='music3' begin='musicLongRead.end-1.0s' end='outro.end-5.0s' soundLevel='-10.0dB' fadeInDur='1.5s' fadeOutDur='2.5s' repeatCount='10'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_2l.ogg'/>
    </media>

    <media xml:id='music4' begin='music3.end-1.9s' end='outro.end+4.0s' soundLevel='-4.0dB' fadeInDur='1.0s' fadeOutDur='3.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_i.ogg'/>
    </media>`;
  return ssml;
};

export { generateSundaySSML };
