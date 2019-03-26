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
 */
const isValidResult = (result: Result): boolean => {
  return (
    result.type === 'article' &&
    result.pillarId === 'pillar/news' &&
    hasBodyText(result) &&
    !isMorningBriefing(result) &&
    !hasGuardianReadersProfile(result) &&
    !hasToneTagAnalysis(result) &&
    !hasToneTagFeatures(result)
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

const hasBodyText = (result: Result): boolean => {
  return result.fields.bodyText.length > 0;
};

export {
  isValidResult,
  isMorningBriefing,
  hasGuardianReadersProfile,
  hasToneTagAnalysis,
};
