import { Article } from '../../models/contentModels';
import { FallbackBriefing } from '../../models/responseModels';
import { stripExcessWhitespace, encodeStringForSSML } from './SSMLUtils';

/*
Very hacky generation of SSML.
*/

const generateFallbackSSML = (fallbackBriefing: FallbackBriefing) => {
  const topStories = fallbackBriefing.topStories;
  const topStoriesSSML = generateTopStories(
    topStories.story1,
    topStories.story2,
    topStories.story3
  );
  const trendingArticleSSML = generateTrendingArticle(
    fallbackBriefing.trendingArticle,
    'wordsHD3'
  );
  const finalStorySSML = generateFinalStory(topStories.story4, 'wordsTIF');
  const outro = generateOutro('wordsTrending');
  return fallbackBriefingSSML(
    topStoriesSSML,
    trendingArticleSSML,
    finalStorySSML,
    outro
  );
};

const fallbackBriefingSSML = (
  topStoriesSSML: string,
  trendingArticleSSML: string,
  finalStorySSML: string,
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
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_intro_m-3.ogg'/>
      </media>

      ${topStoriesSSML}
      ${trendingArticleSSML}
      ${finalStorySSML}
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
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_HL1_m-3.ogg'/>
    </media>

    <media xml:id='wordsHL1' begin='HL1.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story1.standfirst)}
      </speak>
    </media>

    <media xml:id='HL2' begin='wordsHL1.end-0.5s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_HL2_m-3.ogg'/>
    </media>

    <media xml:id='wordsHL2' begin='HL2.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story2.standfirst)}
      </speak>
    </media>

    <media xml:id='HL3' begin='wordsHL2.end-0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_HL3_m-3.ogg'/>
    </media>

    <media xml:id='wordsHD3' begin='HL3.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(story3.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateTrendingArticle = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='TIF' begin='${previous}.end+0.8s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Trending_m-3.ogg'/>
    </media>

    <media xml:id='wordsTIF' begin='TIF.end+0.0s' soundLevel='-1dB'>
      <speak>${encodeStringForSSML(article.headline)}.
        <break strength='strong'/>
        ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateFinalStory = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='trending' begin='${previous}.end+0.4s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_HL4_m-3.ogg'/>
    </media>

    <media xml:id='wordsTrending' begin='trending.end+0.0s' soundLevel='-1dB'>
      <speak>
      ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateOutro = (previous: string) => {
  const ssml = `
    <media xml:id='outro' begin='${previous}.end+0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Outro_m-3.ogg'/>
    </media>

    <media xml:id='music1' begin='advert.end-0.3s' soundLevel='-1.0dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_Intro_s.ogg'/>
    </media>

    <media xml:id='music2' begin='music1.end+0.0s' end='wordsHD3.end+1.0s' soundLevel='-10.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_1l.ogg'/>
    </media>

    <media xml:id='musicTIF' begin='music2.end-1.0s' end='wordsTIF.end+3.0s' soundLevel='-23.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Chop_up_first_Magnified_loop_4_hook_long.ogg'/>
    </media>

    <media xml:id='music3' begin='musicTIF.end-2.0s' end='outro.end-5.0s' soundLevel='-10.0dB' fadeInDur='2.5s' fadeOutDur='2.5s' repeatCount='10'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_2l.ogg'/>
    </media>

    <media xml:id='music4' begin='music3.end-1.9s' end='outro.end+4.0s' soundLevel='-4.0dB' fadeInDur='1.0s' fadeOutDur='3.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_i.ogg'/>
    </media>`;
  return ssml;
};

export { generateFallbackSSML };
