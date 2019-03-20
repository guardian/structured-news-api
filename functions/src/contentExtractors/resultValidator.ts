import { Result } from '../models/capiModels';

/* A result must have:
- the pillarId pillar/news 
- the article type 'article'
- body text
A result must not have
- the morning briefing tag.
 */
const isValidResult = (result: Result): boolean => {
  return (
    result.type === 'article' &&
    result.pillarId === 'pillar/news' &&
    !isMorningBriefing(result) &&
    hasBodyText(result)
  );
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

export { isValidResult, isMorningBriefing };
