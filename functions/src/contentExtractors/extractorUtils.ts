import * as sanitizeHtml from 'sanitize-html';

import { Article, ContentError } from '../models/contentModels';
import { CapiResult, Element, Result } from '../models/capiModels';

import fetch from 'node-fetch';

const stripHTMLTags = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
    allowedIframeHostnames: [],
  });
};

const getTextBlocksFromArticle = (result: Result): string[] => {
  const articleText: string = extractAndConcatinateTextElementsFromHTML(result);
  return articleText.split('\n');
};

const extractAndConcatinateTextElementsFromHTML = (result: Result): string => {
  const reducer = (acc: string, currentElement: Element): string => {
    const text = currentElement.textTypeData;
    if (text === undefined) {
      return acc;
    } else {
      return acc + text.html;
    }
  };

  return result.blocks.body[0].elements
    .filter(element => element.type === 'text')
    .reduce(reducer, '');
};

const getCapiArticle = (
  path: string,
  capiKey: string
): Promise<Article | ContentError> => {
  const url = `https://content.guardianapis.com${path}?api-key=${capiKey}&show-fields=headline,standfirst&show-blocks=all`;
  return fetch(url)
    .then<CapiResult>(res => {
      return res.json();
    })
    .then(capiResponse => {
      const article = capiResponse.response.content;
      return new Article(
        article.fields.headline,
        stripHTMLTags(article.fields.standfirst),
        article.webUrl
      );
    })
    .catch(e => {
      console.error(
        `Could not get article from CAPI with path ${path}. Error: ${e}`
      );
      return new ContentError(
        `Could not get article from CAPI with path ${path}.`
      );
    });
};

const getFirstSentence = (text: string): string => {
  return `${text.split('. ')[0]}.`;
};

const isMorningBriefing = (result: Result) => {
  // Check if result has the morning briefing tag
  return (
    result.tags.filter(
      tag => tag.id === 'world/series/guardian-morning-briefing'
    ).length > 0
  );
};

const hasBodyText = (result: Result): boolean => {
  return result.fields.bodyText.length > 0;
};

export {
  stripHTMLTags,
  getTextBlocksFromArticle,
  getCapiArticle,
  getFirstSentence,
  isMorningBriefing,
  hasBodyText,
};
