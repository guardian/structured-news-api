import {
  ContentError,
  Index,
  OptionContent,
  OptionIndex,
  OutOfBounds,
  URL,
} from '../models/contentModels';
import { getCapiArticle, getTextBlocksFromArticle } from '../utils';

import { Result } from '../models/capiModels';
import { load } from 'cheerio';

/*
Current Morning briefing rules for reading material:
Take the Lunchtime Read The Morning Briefing and return the headline and standfirst.
*/

// Iterate through the Morning Briefing until the lunchtime read section is found

const findIndexOfLunchTimeReadHeader = (textBlocks: string[]): OptionIndex => {
  let i = 0;
  let foundReadingMaterial = false;

  while (textBlocks.length > i && !foundReadingMaterial) {
    const $: CheerioStatic = load(textBlocks[i]);
    const element = $('h2').html() || '';
    if (
      element.length > 0 &&
      element.toLowerCase().includes('lunchtime read:')
    ) {
      foundReadingMaterial = true;
    }
    i += 1;
  }

  return foundReadingMaterial ? new Index(i) : new OutOfBounds();
};

const extractLunchTimeReadURLFromMorningBriefing = (
  textBlocks: string[],
  index: Index
): URL | ContentError => {
  let i = index.index;
  let url = '';
  let foundLink = false;

  while (textBlocks.length > i && !foundLink) {
    const $: CheerioStatic = load(textBlocks[i]);
    const element = $('a').attr('href') || '';
    if (element.length > 0) {
      foundLink = true;
      url = element;
    }
    i += 1;
  }

  return foundLink ? new URL(url) : new ContentError('Could not extract URL');
};

const getReadingMaterialURL = (result: Result): URL | ContentError => {
  const textBlocks: string[] = getTextBlocksFromArticle(result);
  const lunchTimeReadIndex = findIndexOfLunchTimeReadHeader(textBlocks);

  if (lunchTimeReadIndex instanceof Index) {
    return extractLunchTimeReadURLFromMorningBriefing(
      textBlocks,
      lunchTimeReadIndex
    );
  } else {
    return new ContentError('Could not extract URL');
  }
};

const getReadingMaterial = (
  result: Result,
  capiKey: string
): Promise<OptionContent> => {
  const content = getReadingMaterialURL(result);
  if (content instanceof URL) {
    const path = getPathFromGuardianURL(content.url);
    return getCapiArticle(path, capiKey);
  } else {
    return new Promise(_ => content);
  }
};

const getPathFromGuardianURL = (url: string) => {
  const path = url.replace('https://www.theguardian.com', '').split('?')[0];
  return path;
};

export { getReadingMaterial, getPathFromGuardianURL, getReadingMaterialURL };
