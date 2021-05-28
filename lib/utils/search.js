import { normalise } from './normalise';
import { removeCommonWords } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm);
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(resource => {
      const normalisedDescription = normalise(resource.description);
      return (
        normalisedDescription.includes(normalisedSearchTerm) ||
        words.some(word => normalisedDescription.includes(word))
      );
    });

    return item;
  });
};

export { getSearchResults };
