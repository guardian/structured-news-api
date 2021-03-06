import {
  Article,
  TopStories,
  WeekdayAMBriefing,
} from '../../models/contentModels';
import { stripExcessWhitespace, encodeStringForSSML } from './SSMLUtils';

/*
Very hacky generation of SSML.
*/

const generateWeekdayAMSSML = (
  weekdayAMBriefing: WeekdayAMBriefing
): [string, string] => {
  const topStoriesSSML = generateTopStories(weekdayAMBriefing.topStories);
  const todayInFocusSSML = generateTodayInFocus(weekdayAMBriefing.todayInFocus);
  const finalArticle = generateFinalArticle(
    weekdayAMBriefing.topStories.story4,
    'wordsTIF'
  );
  const outro = generateOutro('wordsFinalArticle');
  const musicPart1 = getMusicPart1();
  const musicPart2 = getMusicPart2();
  return weekdayAMBriefingSSML(
    topStoriesSSML,
    todayInFocusSSML,
    finalArticle,
    outro,
    musicPart1,
    musicPart2
  );
};

const weekdayAMBriefingSSML = (
  topStoriesSSML: string,
  todayInFocusSSML: string,
  finalArticle: string,
  outro: string,
  musicPart1: string,
  musicPart2: string
): [string, string] => {
  const ssml1 = `
  <speak>
    <par>
      <media xml:id='earcon' soundLevel='-3dB'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Earcon.ogg'/>
      </media>
      <media xml:id='advert' begin='earcon.end-0.8s' soundLevel='-2dB'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Advert.ogg'/>
      </media>
      <media xml:id='intro' begin='advert.end+1.4s'>
        <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Intro.ogg'/>
      </media>

      ${topStoriesSSML}
      ${musicPart1}
    </par> 
  </speak>`;
  const ssml2 = `
  <speak>
    <par>
      ${todayInFocusSSML}
      ${finalArticle}
      ${outro}
      ${musicPart2}
    </par> 
  </speak>`;
  return [stripExcessWhitespace(ssml1), stripExcessWhitespace(ssml2)];
};

const generateTopStories = (stories: TopStories) => {
  const ssml = `
    <media xml:id='HL1' begin='intro.end-0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/HL1.ogg'/>
    </media>

    <media xml:id='wordsHL1' begin='HL1.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(
          stories.story1.headline
        )}<break strength='strong'/>
        ${encodeStringForSSML(stories.story1.standfirst)}
      </speak>
    </media>

    <media xml:id='HL2' begin='wordsHL1.end-0.5s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/HL2.ogg'/>
    </media>

    <media xml:id='wordsHL2' begin='HL2.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(
          stories.story2.headline
        )}<break strength='strong'/>
        ${encodeStringForSSML(stories.story2.standfirst)}
      </speak>
    </media>

    <media xml:id='HL3' begin='wordsHL2.end-0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Morning_Briefing_UK_HL3.ogg'/>
    </media>

    <media xml:id='wordsHD3' begin='HL3.end-0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(
          stories.story3.headline
        )}<break strength='strong'/>
        ${encodeStringForSSML(stories.story3.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateTodayInFocus = (article: Article) => {
  const ssml = `
    <media xml:id='TIF'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/TIF.ogg'/>
    </media>

    <media xml:id='wordsTIF' begin='TIF.end+0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article.headline)}.
        <break strength='strong'/>
        ${generateTodayInFocusStandfirst(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateTodayInFocusStandfirst = (standfirst: string) => {
  const sentences = standfirst.split('.');
  return sentences
    .map(sentence => {
      if (sentence.length > 0) {
        return `${sentence}. <break strength='strong'/>`;
      } else {
        return '';
      }
    })
    .reduce((acc, item) => {
      return acc + item;
    }, '');
};

const generateFinalArticle = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='FinalArticle' begin='${previous}.end+0.4s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Morning_Briefing_HL4.ogg'/>
    </media>

    <media xml:id='wordsFinalArticle' begin='FinalArticle.end+0.0s' soundLevel='-1dB'>
      <speak>
        ${encodeStringForSSML(article.headline)}
        <break strength='strong'/>
        ${encodeStringForSSML(article.standfirst)}
      </speak>
    </media>`;
  return ssml;
};

const generateOutro = (previous: string) => {
  const ssml = `
    <media xml:id='outro' begin='${previous}.end+0.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/MorningBriefingOutro.ogg'/>
    </media>`;
  return ssml;
};

const getMusicPart1 = () => {
  const ssml = `
    <media xml:id='music1' begin='advert.end-0.3s' soundLevel='-1.0dB'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_Intro_s.ogg'/>
    </media>

    <media xml:id='music2' begin='music1.end+0.0s' end='wordsHD3.end+1.0s' soundLevel='-10.0dB' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_1l.ogg'/>
    </media>`;
  return ssml;
};

const getMusicPart2 = () => {
  const ssml = `
    <media xml:id='musicTIF' end='wordsTIF.end+3.0s' soundLevel='-23.0dB' fadeInDur='1.0s' fadeOutDur='3.0s' repeatCount='20'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/TIF_m.ogg'/>
    </media>

    <media xml:id='music3' begin='musicTIF.end-2.0s' end='outro.end-5.0s' soundLevel='-10.0dB' fadeInDur='2.5s' fadeOutDur='2.5s' repeatCount='10'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_2l.ogg'/>
    </media>

    <media xml:id='music4' begin='music3.end-1.9s' end='outro.end+4.0s' soundLevel='-4.0dB' fadeInDur='1.0s' fadeOutDur='3.0s'>
      <audio src='https://storage.googleapis.com/gu-briefing-audio-assets/Fbird_i.ogg'/>
    </media>`;
  return ssml;
};

export { generateWeekdayAMSSML, generateTodayInFocusStandfirst };
