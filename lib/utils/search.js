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
