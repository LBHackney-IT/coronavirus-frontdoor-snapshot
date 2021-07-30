import { normalise } from './normalise';
import { removeCommonWords, getSearchableFields } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources
      .map(resource => {
        const resourceIndex = getSearchableFields(resource);
        resource.weight = getWeight(normalisedSearchTerm, words, resource, resourceIndex);
        return resource;
      })
      .filter(x => x.weight > 0);

    return item;
  });
};

const getWeight = (searchTerm, words, resource, resourceIndex) => {
  let weight = 0;

  weight += getFullPhraseWeight(searchTerm, resourceIndex);
  weight += getIndividualWordsWeight(words, resourceIndex);
  weight += getSynonymsWeight(words, resourceIndex, searchTerm);

  const canReferToService = resource.referralContact || resource.referralWebsite;

  if (weight > 0 && canReferToService) weight += 50;

  return weight;
};

const getFullPhraseWeight = (searchTerm, resourceIndex) => {
  if (Object.values(resourceIndex).some(x => x.includes(searchTerm))) return 75;
  return 0;
};

const getIndividualWordsWeight = (words, resourceIndex) => {
  const resourceIndexValues = Object.values(resourceIndex);
  const wordsMatchedInTitle = words.filter(word => resourceIndex.name.includes(word)).length;
  const wordsMatched = words.filter(word => resourceIndexValues.some(x => x.includes(word))).length;

  return wordsMatched * 25 + wordsMatchedInTitle * 25;
};

const getSynonymsWeight = (words, resourceIndex, searchTerm) => {
  const synonyms = isJSON(process.env.SYNONYMS) ? JSON.parse(process.env.SYNONYMS) : '{}';
  const resourceIndexValues = Object.values(resourceIndex);

  const foundSynonymsFullPhrase = Object.keys(synonyms).filter(key =>
    synonyms[key].includes(searchTerm)
  );

  const fullPhraseSynonymsMatched = resourceIndexValues.filter(x =>
    foundSynonymsFullPhrase.some(synonym => x.includes(synonym))
  ).length;

  if (fullPhraseSynonymsMatched > 0) return fullPhraseSynonymsMatched * 30;

  const foundSynonyms = words.map(word =>
    Object.keys(synonyms).filter(key => synonyms[key].includes(word))
  );

  const synonymsMatched = foundSynonyms.filter(synonymArray =>
    resourceIndexValues.some(x => synonymArray.some(synonym => x.includes(synonym)))
  ).length;

  return synonymsMatched * 25;
};

const isJSON = text => {
  if (!text) return false;
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
};

const getWordsToHighlight = searchTerm => {
  const synonyms = isJSON(process.env.SYNONYMS) ? JSON.parse(process.env.SYNONYMS) : '{}';

  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  const foundSynonyms = words.map(word =>
    Object.keys(synonyms).find(key => synonyms[key].includes(word))
  );

  return words.concat(foundSynonyms).filter(x => x);
};

export { getSearchResults, getWordsToHighlight };
