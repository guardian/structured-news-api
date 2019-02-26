import { Article, MorningBriefing, TopStories } from '../models/contentModels';

/*
Very hacky generation of SSML.
*/

const generateSSML = (morningBriefing: MorningBriefing) => {
  const topStories = morningBriefing.topStories;
  const todayInFocus = morningBriefing.todayInFocus;
  const readingMaterial = morningBriefing.readingMaterial;
  if (
    topStories instanceof TopStories &&
    todayInFocus instanceof Article &&
    readingMaterial instanceof Article
  ) {
    const topStoriesSSML = generateTopStories(topStories);
    const todayInFocusSSML = generateTodayInFocus(todayInFocus, 'wordsHD3');
    const readingMaterialSSML = generateReadingMaterial(
      readingMaterial,
      'musicTIF'
    );
    const outro = generateOutro('wordslongread');
    return morningBriefingSSML(
      topStoriesSSML,
      todayInFocusSSML,
      readingMaterialSSML,
      outro
    );
  }
  // Take into account missing Today in Focus
  if (topStories instanceof TopStories && readingMaterial instanceof Article) {
    const topStoriesSSML = generateTopStories(topStories);
    const readingMaterialSSML = generateReadingMaterial(
      readingMaterial,
      'wordsHD3'
    );
    const outro = generateOutro('wordslongread');
    return morningBriefingSSML(topStoriesSSML, '', readingMaterialSSML, outro);
  } else {
    return 'SSML generation failed';
  }
};

const morningBriefingSSML = (
  topStoriesSSML: string,
  todayInFocusSSML: string,
  readingMaterialSSML: string,
  outro: string
) => {
  const ssml = `<speak>
  <par>
    <media xml:id='earcon' begin='0.0s' soundLevel='-5dB' fadeOutDur='0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/cheery_earcon1b_comp_fade_lmt.ogg'>
            <desc>news intro</desc>
        INTRO
      </audio>
    </media>
      <media xml:id='intro' begin='earcon.end+0.5s' soundLevel='0dB' fadeOutDur='0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_Intro_-3db.ogg'>
            <desc>news intro</desc>
        INTRO
      </audio>
    </media>
    
    ${topStoriesSSML}
    ${todayInFocusSSML}
    ${readingMaterialSSML}
    ${outro}
  </par> 
</speak>`;
  return ssml.replace('&', '&amp;').replace(/\s\s+/g, '');
};

const generateTopStories = (stories: TopStories) => {
  const ssml = `
    <media xml:id='headline1' begin='intro.end-0.0s' soundLevel='0dB' fadeOutDur='0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_HL1_-3db.ogg'>
        <desc>headline 1</desc>
        headline 1
      </audio>
    </media>

    <media xml:id='wordsHD1' begin='headline1.end-0.0s'>
      <speak>
        ${stories.story1.headline}.<break strength='strong'/>
        ${stories.story1.standfirst}
      </speak>
    </media>

    <media xml:id='headline2' begin='wordsHD1.end-0.5s' soundLevel='0dB'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_HL2_-3db.ogg'>
        <desc>news intro</desc>
        INTRO
      </audio>
    </media>

    <media xml:id='wordsHD2' begin='headline2.end-0.0s'>
      <speak>
        ${stories.story2.headline}<break strength='strong'/>
        ${stories.story2.standfirst}
      </speak>
    </media>

    <media xml:id='headline3' begin='wordsHD2.end-0.0s' soundLevel='0dB'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_HL3_-3db.ogg'>
      <desc>news intro</desc>
        INTRO
      </audio>
    </media>

    <media xml:id='wordsHD3' begin='headline3.end-0.0s'>
      <speak>
        ${stories.story3.headline}<break strength='strong'/>
        ${stories.story3.standfirst}
      </speak>
    </media>`;
  return ssml;
};

const generateTodayInFocus = (article: Article, previous: string) => {
  const ssml = `
    <media xml:id='TIFpush' begin='${previous}.end-0.0s' soundLevel='0dB' fadeOutDur='0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_TiF_-3db.ogg' clipBegin='0.0s'>
        <desc>team cheer</desc>
        CHEER!
      </audio>
    </media>

    <media xml:id='wordsTIF' begin='TIFpush.end+0.5s'>
      <speak>${article.headline}
        <break strength='strong'/>
        ${article.standfirst}
      </speak>
    </media>`;
  return ssml;
};

const generateReadingMaterial = (article: Article, previous: string) => {
  const ssml = `<media xml:id = 'longread' begin = '${previous}.end-1.6s' soundLevel = '0dB' fadeOutDur = '0.0s' >
    <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_Reading_-3db.ogg' clipBegin = '0.0s' >
      <desc>team cheer </desc>
  CHEER!
    </audio>
    </media>

    <media xml:id = 'wordslongread' begin = 'longread.end+0.0s' soundLevel = '0dB' fadeOutDur = '0.0s' >
      <speak>
      ${article.headline} <break strength='strong' />
      ${article.standfirst}
      </speak>
    </media>`;
  return ssml;
};

const generateOutro = (previous: string) => {
  const ssml = `<media xml:id='OUTRO' begin='${previous}.end+0.0s' soundLevel='0dB' fadeOutDur='0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Leah_v2_Outro_-3db.ogg' clipBegin='0.0s'>
      </audio>
    </media>

    <media xml:id='music1' soundLevel='-3.0dB' fadeInDur='0.0s' fadeOutDur='0.0s' begin='earcon.end-1.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Firebird_Intro_short.ogg'/>
    </media>

    <media xml:id='music2' soundLevel='-12.0dB' fadeInDur='0.0s' fadeOutDur='0.0s' begin='music1.end+0.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Firebird_1.ogg'/>
    </media>

    <media xml:id='music2b' soundLevel='-12.0dB' repeatCount='20' fadeInDur='0.0s' fadeOutDur='3.0s' begin='music1.end+0.0s' end='wordsHD3.end+1.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Firebird_mute_Drum_Loop_2.ogg'/>
    </media>

    <media xml:id='musicTIF' soundLevel='-25.0dB' repeatCount='20' fadeInDur='1.5s' fadeOutDur='2.0s' begin='music2b.end-0.0s' end='wordsTIF.end+2.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/TIF_loop.ogg'/>
    </media>

    <media xml:id='music3' soundLevel='-12.0dB' repeatCount='10' fadeInDur='3.0s' fadeOutDur='2.0s' begin='musicTIF.end-0.0s' end='OUTRO.end-3.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Firebird_Synth_Drum_Loop_2.ogg'/>
    </media>

    <media xml:id='music3out' soundLevel='-8.0dB' fadeInDur='0.0s' fadeOutDur='3.0s' begin='music3.end0.0s' end='OUTRO.end+4.0s'>
      <audio src='https://storage.googleapis.com/guardian-briefing-audio-assets/Firebird_Intro.ogg'>
      </audio>
    </media>`;
  return ssml;
};

export { generateSSML };
