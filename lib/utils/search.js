import { normalise } from './normalise';
import { removeCommonWords, getSearchableFields } from 'lib/utils/searchHelper';
const synonyms = require('./synonyms.json');

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources
      .map(resource => {
        const resourceIndex = Object.values(getSearchableFields(resource));
        resource.weight = getWeight(normalisedSearchTerm, words, resourceIndex);
        return resource;
      })
      .filter(x => x.weight > 0);

    return item;
  });
};

const getWeight = (searchTerm, words, resourceIndex) => {
  const foundSynonyms = words.map(word =>
    Object.keys(synonyms).find(key => synonyms[key].includes(word))
  );
  if (resourceIndex.some(x => x.includes(searchTerm))) return 100;
  if (words.some(word => resourceIndex.some(x => x.includes(word)))) return 50;
  if (foundSynonyms.some(synonym => resourceIndex.some(x => x.includes(synonym)))) return 25;
  return 0;
};

export { getSearchResults };
