import { normalise } from './normalise';
import { removeCommonWords, getSearchableFields } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(resource => {
      const normalisedFields = getSearchableFields(resource);

      return (
        Object.values(normalisedFields).some(x => x.includes(normalisedSearchTerm)) ||
        words.some(word => Object.values(normalisedFields).some(x => x.includes(word)))
      );
    });

    return item;
  });
};

export { getSearchResults };
