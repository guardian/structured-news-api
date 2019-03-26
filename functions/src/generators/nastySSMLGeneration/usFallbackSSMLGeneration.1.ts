import { Article, FallbackBriefing } from '../../models/contentModels';
import { stripExcessWhitespace, encodeStringForSSML } from './SSMLUtils';

/*
Very hacky generation of SSML.
*/

const generateUSFallbackSSML = (fallbackBriefing: FallbackBriefing) => {
  const topArticles = fallbackBriefing.topArticles;
  const topArticlesSSML = generateTopArticles(
    topArticles.article1,
    topArticles.article2,
    topArticles.article3
  );
  const trendingArticleSSML = generateTrendingArticle(
    fallbackBriefing.trendingArticle,
    'wordsHD3'
  );
  const finalArticleSSML = generateFinalArticle(
    topArticles.article4,
    'wordsTrending'
  );
  const outro = generateOutro('wordsFinalArticle');
  return fallbackBriefingSSML(
    topArticlesSSML,
    trendingArticleSSML,
    finalArticleSSML,
    outro
  );
};

const fallbackBriefingSSML = (
  topArticlesSSML: string,
  trendingArticleSSML: string,
  finalArticleSSML: string,
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
      <media xml:id='intro' begin='advert.end+1.4s' soundLevel='-2.5dB'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_Intro.ogg'/>
      </media>

      ${topArticlesSSML}
      ${trendingArticleSSML}
      ${finalArticleSSML}
      ${outro}
    </par> 
  </speak>`;
  return stripExcessWhitespace(ssml);
};

const generateTopArticles = (
  article1: Article,
  article2: Article,
  article3: Article
) => {
  const ssml = `
    <media xml:id='HL1' begin='intro.end-0.0s' soundLevel='-2.5dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_HL1.ogg'/>
    </media>

    <media xml:id='wordsHL1' begin='HL1.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article1.standfirst)}
      </speak>
    </media>

    <media xml:id='HL2' begin='wordsHL1.end-0.5s' soundLevel='-2.5dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_HL2.ogg'/>
    </media>

    <media xml:id='wordsHL2' begin='HL2.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article2.standfirst)}
      </speak>
    </media>

    <media xml:id='HL3' begin='wordsHL2.end-0.0s' soundLevel='-2.5dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_HL3.ogg'/>
    </media>

    <media xml:id='wordsHD3' begin='HL3.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article3.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateTrendingArticle = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='Trending' begin='${previous}.end+0.8s' soundLevel='-2.5dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_Trending.ogg'/>
    </media>

    <media xml:id='wordsTrending' begin='Trending.end+0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateFinalArticle = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='FinalArticle' begin='${previous}.end+0.4s' soundLevel='-2.5dB'> 
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_HL4.ogg'/>
    </media>

    <media xml:id='wordsFinalArticle' begin='FinalArticle.end+0.0s' soundLevel='-1dB'>
      <speak>
      ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateOutro = (previous: string) => {
  const ssml = `
    <media xml:id='outro' begin='${previous}.end+0.0s' soundLevel='-2.5dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fallback_Briefing_US_Outro.ogg'/>
    </media>

    <media xml:id='music1' begin='advert.end-0.3s' soundLevel='-1.0dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_Intro_s.ogg'/>
    </media>

    <media xml:id='music2' begin='music1.end+0.0s' end='wordsHD3.end+1.0s' soundLevel='-10.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_1l.ogg'/>
    </media>

    <media xml:id='musicTrending' begin='music2.end-1.0s' end='wordsTrending.end+3.0s' soundLevel='-23.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Chop_up_first_Magnified_loop_4_hook_long.ogg'/>
    </media>

    <media xml:id='music3' begin='musicTrending.end-2.0s' end='outro.end-5.0s' soundLevel='-10.0dB' fadeInDur='2.5s' fadeOutDur='2.5s' repeatCount='10'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_2l.ogg'/>
    </media>

    <media xml:id='music4' begin='music3.end-1.9s' end='outro.end+4.0s' soundLevel='-4.0dB' fadeInDur='1.0s' fadeOutDur='3.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_i.ogg'/>
    </media>`;
  return ssml;
};

export { generateUSFallbackSSML };
