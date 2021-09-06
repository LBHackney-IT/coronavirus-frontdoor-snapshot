import { normalise } from './normalise';
import { removeCommonWords, getSearchableFields } from 'lib/utils/searchHelper';

const filterByCategories = (selectedCategories, items) => {
  if (!selectedCategories || !selectedCategories.length) return items;

  return items.filter(category => selectedCategories.includes(category.name));
};

const filterOutExcludedWords = (searchTerm, items, selectedSpecificNeeds = []) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));
  let wordsToInclude = getSpecificNeedsWords(selectedSpecificNeeds);
  let excludedWords = getExcludedWords(words.concat(wordsToInclude));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(item => !includesExcludedWord(excludedWords, item));
    return item;
  });
};

const includesExcludedWord = (excludedWords, item) => {
  const resourceIndex = getSearchableFields(item);
  return getIndividualWordsWeight(excludedWords, resourceIndex) > 0;
};

const getExcludedWords = searchedWords => {
  const exclusions = isJSON(process.env.SEARCH_EXCLUSIONS)
    ? JSON.parse(process.env.SEARCH_EXCLUSIONS)
    : [];

  return exclusions
    .filter(
      exclusion =>
        exclusion.excludeWords.filter(excludeWord => searchedWords.includes(normalise(excludeWord)))
          .length == 0
    )
    .map(exclusion => exclusion.excludeWords)
    .flat();
};

const getSpecificNeedsWords = labels => {
  const exclusions = isJSON(process.env.SEARCH_EXCLUSIONS)
    ? JSON.parse(process.env.SEARCH_EXCLUSIONS)
    : [];

  return exclusions
    .filter(exclusion => labels.includes(exclusion.label))
    .map(exclusion => exclusion.excludeWords)
    .flat();
};

const getSearchWithWeights = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.map(resource => {
      let currentWeight = resource.weight || 0;
      resource.weight = currentWeight + getWeight(normalisedSearchTerm, resource, words);
      return resource;
    });

    return item;
  });
};

const getWeight = (searchTerm, resource, words) => {
  const resourceIndex = getSearchableFields(resource);

  let weight = resource.weight || 0;

  weight += getFullPhraseWeight(searchTerm, resourceIndex);
  weight += getIndividualWordsWeight(words, resourceIndex);
  weight += getSynonymsWeight(words, resourceIndex, searchTerm);
  weight += (resource.referralContact || resource.referralWebsite) && weight > 0 ? 50 : 0;

  return weight;
};

const weightByCategories = (selectedCategories, items) => {
  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.map(resource => {
      let currentWeight = resource.weight || 0;
      resource.weight = currentWeight + getCategoryWeight(selectedCategories, items, resource);
      return resource;
    });
    return item;
  });
};

const getCategoryWeight = (selectedCategories, categorisedResources, resource) => {
  const categoriesResourceIsIn = categorisedResources
    .filter(category => category.resources.some(r => r.id == resource.id))
    .map(x => x.name);

  const selectedCategoriesResourceIsIn = selectedCategories.filter(name =>
    categoriesResourceIsIn.includes(name)
  );

  const unselectedCategoriesResourceIsIn = categoriesResourceIsIn.filter(
    name => !selectedCategories.includes(name)
  );

  let percentageMatch = (selectedCategoriesResourceIsIn.length / selectedCategories.length) * 100;

  unselectedCategoriesResourceIsIn.forEach(e => {
    percentageMatch = percentageMatch * 0.8;
  });

  return percentageMatch | 0;
};

const getFullPhraseWeight = (searchTerm, resourceIndex) => {
  if (Object.values(resourceIndex).some(x => x.includes(searchTerm))) return 75;
  return 0;
};

const getIndividualWordsWeight = (words, resourceIndex) => {
  if (!words) return 0;
  const resourceIndexValues = Object.values(resourceIndex);
  const wordsMatchedInTitle = words.filter(word => resourceIndex.name.includes(word)).length;
  const wordsMatched = words.filter(word => resourceIndexValues.some(x => x.includes(word))).length;

  return wordsMatched * 25 + wordsMatchedInTitle * 25;
};

const getSynonymsWeight = (words, resourceIndex, searchTerm) => {
  if (!searchTerm) return 0;
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

const capitalise = phrase => {
  return phrase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getDifferentCasing = array => {
  return array
    .concat(array.map(word => capitalise(word)))
    .concat(array.map(word => word.toUpperCase()));
};

const getWordsToHighlight = searchTerm => {
  if (!searchTerm) return [];
  const synonyms = isJSON(process.env.SYNONYMS) ? JSON.parse(process.env.SYNONYMS) : '{}';

  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  let highlightables = getDifferentCasing([normalisedSearchTerm]);

  highlightables[0] !== words[0]
    ? (highlightables = highlightables.concat(getDifferentCasing(words)))
    : null;

  const foundSynonyms = highlightables
    .map(highlightable => Object.keys(synonyms).find(key => synonyms[key].includes(highlightable)))
    .filter(x => x);

  highlightables = highlightables.concat(getDifferentCasing(foundSynonyms));

  return highlightables
    .map(x => x.replace(new RegExp(/[$-/:-?{-~!"^_`]/), ''))
    .filter(x => x != '');
};

const flattenSearchResults = searchResults => {
  if (!searchResults) return { resources: [] };
  const resources = searchResults.map(category => category.resources).flat();
  let res = [];
  resources.forEach(resource => {
    let index = res.findIndex(x => x.id === resource.id);
    if (index > -1) {
      res[index].description = [res[index].description, resource.description]
        .filter(x => x?.trim())
        .map(x => x.trim())
        .join('. ');
      res[index].weight = Math.floor((res[index].weight + resource.weight) / 2);
    } else {
      res.push(resource);
    }
  });
  return {
    name: `${res.length} ${res.length == 1 ? 'result' : 'results'}`,
    resources: res
  };
};

const weightByKeywords = (searchTerm, selectedCategories, selectedSpecificNeeds, resources) => {
  let searchResults = resources;
  if (searchTerm) {
    searchResults = getSearchWithWeights(searchTerm, resources);
  } else if (selectedCategories.length > 0) {
    searchResults = getSearchWithWeights(selectedCategories.join(' '), resources);
  }

  if (selectedSpecificNeeds.length > 0) {
    const specificNeedsWords = getSpecificNeedsWords(selectedSpecificNeeds);
    searchResults = getSearchWithWeights(specificNeedsWords.join(' '), resources);
  }
  return searchResults;
};

const filterIrrelevantResults = searchResults => {
  return searchResults.map(item => {
    item.resources = item.resources.filter(x => x.weight > 0);
    return item;
  });
};

const getSearchResult = ({
  categorisedResources = [],
  searchTerm = '',
  selectedCategories = [],
  selectedSpecificNeeds = []
}) => {
  let searchResults = { resources: [] };

  searchResults = filterByCategories(selectedCategories, categorisedResources);

  if (searchTerm || selectedCategories.length > 0) {
    searchResults = filterOutExcludedWords(searchTerm, searchResults, selectedSpecificNeeds);
  }

  searchResults = weightByKeywords(
    searchTerm,
    selectedCategories,
    selectedSpecificNeeds,
    searchResults
  );

  if (searchTerm || selectedSpecificNeeds.length > 0) {
    searchResults = filterIrrelevantResults(searchResults);
  }

  searchResults = weightByCategories(selectedCategories, searchResults);

  searchResults = flattenSearchResults(searchResults);
  searchResults.resources.sort((a, b) => b.weight - a.weight);
  return searchResults;
};

export {
  getSearchWithWeights,
  getWordsToHighlight,
  filterByCategories,
  weightByCategories,
  isJSON,
  filterOutExcludedWords,
  getSpecificNeedsWords,
  getSearchResult
};
