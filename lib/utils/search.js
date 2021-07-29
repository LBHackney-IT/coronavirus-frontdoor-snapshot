import { normalise } from './normalise';
import { removeCommonWords, getSearchableFields } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  const synonyms = isJSON(process.env.SYNONYMS) ? JSON.parse(process.env.SYNONYMS) : '{}';

  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources
      .map(resource => {
        const resourceIndex = Object.values(getSearchableFields(resource));
        resource.weight = getWeight(normalisedSearchTerm, words, resourceIndex, synonyms);
        return resource;
      })
      .filter(x => x.weight > 0);

    return item;
  });
};

const getWeight = (searchTerm, words, resourceIndex, synonyms) => {
  const foundSynonyms = words.map(word =>
    Object.keys(synonyms).filter(key => synonyms[key].includes(word))
  );
  if (resourceIndex.some(x => x.includes(searchTerm))) return 100;
  if (words.some(word => resourceIndex.some(x => x.includes(word)))) return 50;
  if (
    foundSynonyms.some(synonymArray =>
      resourceIndex.some(x => synonymArray.some(synonym => x.includes(synonym)))
    )
  )
    return 25;
  return 0;
};

const isJSON = text => {
  if (!text) return false;
  try {
z    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
};
const toWords = (text) => text.split(/[\s,\.!\?]+/).filter(Boolean);

// Should return an object containing case-sensitive word
// so that replacement would be easier. It can get extended for
// other fields like 'organisationName':
// {
//   description: ["Lightning", "rod", ... , "grounding"],
//   organisationName: []
// }
// There is a lot of code repetition, so it can be refactored. This is just
// the first draft. No tests yet.
const getMatchingKeywords = (searchTerm, categorisedResources) => {
  let matchingKeywordsByType = {
    description: []
  };

  // Prep
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let normalisedSearchTermWords = removeCommonWords(normalisedSearchTerm.split(' '));
  
  const foundSynonyms = words.map(word =>
    Object.keys(synonyms).find(key => synonyms[key].includes(word))
  );
  const orderedDescriptionWords = toWords(service.description);
  const descriptionNormToActualDict = orderedDescriptionWords.map(descriptionWord => {
    actual: descriptionWord
    normalised: normalise(descriptionWord);
  });

  // for each category
  categorisedResources.forEach(taxonomy => {
    taxonomy.resources
      .forEach(service => {        
        // If exact match happens, don't go granular
        if (normalise(service.description).includes(normalisedSearchTerm)) {
          // could have this improved by playing with string index numbers, but for now this will do:
          const matchingDescriptionWords = descriptionNormToActualDict.filter(pair => {
            const normalisedDescriptionWord = pair.normalised;
            return normalisedSearchTermWords.includes(normalisedDescriptionWord);
          });

          const originalDescriptionWords = matchingDescriptionWords.map(pair => pair.actual);

          matchingKeywordsByType.description.push(originalDescriptionWords); //exact match //not exactly...
          continue;
        }

        // partial match
        normalisedSearchTermWords.forEach(nstw => {
          // doing 'includes' rather than '===' because we want to capture plurals: bank -> banks
          const descriptionMatches = descriptionNormToActualDict.filter(
            pair => {
              const normalisedDescriptionWord = pair.normalised;
              return normalisedDescriptionWord.includes(nstw);
            });

          if (descriptionMatches.length > 0) {
            const originalDescriptionWords = descriptionMatches.map(pair => pair.actual);
            matchingKeywordsByType.description.concat(originalDescriptionWords);
            continue;
          }
        });
        
        // synonym match
        foundSynonyms
          .map(synonym => normalise(synonym))
          .forEach(synonym => {
            const descriptionSynonymMatches = descriptionNormToActualDict.filter(pair => {
              normalisedDescriptionWord = pair.normalised;
              return normalisedDescriptionWord.includes(synonym);
            });

            if (descriptionSynonymMatches.length > 0) {
              const originalDescriptionWords = descriptionSynonymMatches.map(pair => pair.actual);
              matchingKeywordsByType.description.concat(originalDescriptionWords);
              continue;
            }
          });
      })
  });

  return matchingKeywordsByType;
}

export { getSearchResults };
