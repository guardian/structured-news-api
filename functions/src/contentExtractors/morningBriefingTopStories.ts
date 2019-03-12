import { Article, ContentError, TopStories } from '../models/contentModels';
import {
  getTextBlocksFromArticle,
  stripHTMLTags,
  getFirstSentence,
} from './extractorUtils';

import { Result } from '../models/capiModels';
import { load } from 'cheerio';

/*
Current Morning briefing rules for news stories:
First sentence of top story and first sentence of the next 2 stories from the morning briefing https://www.theguardian.com/world/series/guardian-morning-briefing.
This data is extracted from the HTML of the morning briefing article.
Ignore the midweek catchup
*/

const numberOfStoriesNeeded = 3;

const extractArticles = (
  articleParagraphs: string[],
  articleSource: string
): Article[] => {
  // Populate with top story from morning briefing
  const topStory = getTopStory(articleParagraphs, articleSource);
  if (topStory instanceof Article) {
    const stories: Article[] = [topStory];
    // Ignore the top story paragraphs
    const remainingParagraphs = articleParagraphs.slice(3);
    return getStoriesFromMorningBriefing(
      stories,
      remainingParagraphs,
      articleSource
    );
  } else {
    return [];
  }
};

const getTopStory = (
  articleParagraphs: string[],
  articleSource: string
): Article | ContentError => {
  if (articleParagraphs.length > 3) {
    const headline = stripHTMLTags(articleParagraphs[0])
      .replace('Top story: ', '')
      .trimRight();
    // Skip over the paragraph that introduces the morning briefing writer
    const openingParagraph = stripHTMLTags(articleParagraphs[2]);
    const openingSentence = getFirstSentence(openingParagraph);
    return new Article(`${headline}.`, openingSentence, articleSource);
  } else {
    console.error(
      `Could not get Top story from article paragraphs. Input: ${JSON.stringify(
        articleParagraphs
      )}`
    );
    return new ContentError(`Could not get top story from morning briefing`);
  }
};

const getStoriesFromMorningBriefing = (
  stories: Article[],
  articleParagraphs: string[],
  articleSource: string
): Article[] => {
  let i = 0;
  while (
    i < articleParagraphs.length &&
    stories.length < numberOfStoriesNeeded
  ) {
    const $: CheerioStatic = load(articleParagraphs[i]);

    // If there is a <strong> tag then it indicates the start of another story in the morning briefing. Get the parent to extract information about the story.
    const element =
      $('strong')
        .parent()
        .html() || '';

    if (element.length > 0) {
      const elementText = stripHTMLTags(element);
      const firstSentence = getFirstSentence(elementText);

      // Mid week catch up does not count as a news story
      if (!firstSentence.toLowerCase().includes('midweek catch-up')) {
        const optionArticle = convertFirstSentenceToArticle(
          firstSentence,
          articleSource
        );
        if (optionArticle instanceof Article) {
          stories.push(optionArticle);
        }
      }
    }
    i += 1;
  }
  return stories;
};

const convertFirstSentenceToArticle = (
  sentence: string,
  articleSource: string
): Article | ContentError => {
  const sentenceComponents = sentence.split(' – ');
  if (sentenceComponents.length === 2) {
    return new Article(
      `${sentenceComponents[0]}.`,
      sentenceComponents[1],
      articleSource
    );
  } else {
    console.error(
      `Could not extract article components from sentence ${sentence}`
    );
    return new ContentError(
      `Could not extract article components from sentence ${sentence}`
    );
  }
};

const getTopStories = (result: Result): TopStories | ContentError => {
  const articleSource = result.webUrl;
  const articleParagraphs = getTextBlocksFromArticle(result);
  const articles = extractArticles(articleParagraphs, articleSource);
  if (articles.length === numberOfStoriesNeeded) {
    return new TopStories(articles[0], articles[1], articles[2]);
  } else {
    console.error(
      `Could not build TopStories object for ${JSON.stringify(articles)}`
    );
    return new ContentError(
      `Could not build TopStories object for ${JSON.stringify(articles)}`
    );
  }
};

export { getTopStories };
