import { Result } from '../models/capiModels';

/* A result must have:
- the pillarId pillar/news 
- the article type 'article'
- body text
A result must not have
- the morning briefing tag.
- the Guardian Readers contributor tag on it.
- the analysis tone tag on it.
- the features tone tag on it.
- the opinion tone tag on it.
- the id of the 2019 April Fools Article.
 */
const isValidResult = (result: Result): boolean => {
  return (
    result.type === 'article' &&
    result.pillarId === 'pillar/news' &&
    hasBodyText(result) &&
    !isMorningBriefing(result) &&
    !hasGuardianReadersProfile(result) &&
    !hasToneTagAnalysis(result) &&
    !hasToneTagFeatures(result) &&
    !hasToneTagOpinion(result) &&
    !isAprilFoolsArticle2019(result)
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

const hasGuardianReadersProfile = (result: Result) => {
  const guardianReaderProfile = result.tags.filter(
    tag => tag.id === 'profile/guardian-readers' && tag.type === 'contributor'
  );
  return guardianReaderProfile.length > 0;
};

const hasToneTagAnalysis = (result: Result): boolean => {
  return (
    result.tags.filter(tag => tag.id === 'tone/analysis' && tag.type === 'tone')
      .length > 0
  );
};

const hasToneTagFeatures = (result: Result): boolean => {
  return (
    result.tags.filter(tag => tag.id === 'tone/features' && tag.type === 'tone')
      .length > 0
  );
};

const hasToneTagOpinion = (result: Result): boolean => {
  return (
    result.tags.filter(tag => tag.id === 'tone/comment' && tag.type === 'tone')
      .length > 0
  );
};

const hasBodyText = (result: Result): boolean => {
  return result.fields.bodyText.length > 0;
};

const isAprilFoolsArticle2019 = (result: Result) => {
  return (
    result.id ===
    'uk-news/2019/apr/01/proposal-for-healing-tsar-to-reunite-britain-after-brexit'
  );
};

export {
  isValidResult,
  isMorningBriefing,
  hasGuardianReadersProfile,
  hasToneTagAnalysis,
};
