import { normalise } from './normalise';
import { removeCommonWords } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(resource => {
      const normalisedName = normalise(resource.name || '');
      const normalisedDescription = normalise(resource.description || '');
      const normalisedDemographic = normalise(resource.demographic || '');
      const normalisedServiceDescription = normalise(resource.serviceDescription || '');
      return (
        normalisedDescription.includes(normalisedSearchTerm) ||
        normalisedName.includes(normalisedSearchTerm) ||
        normalisedDemographic.includes(normalisedSearchTerm) ||
        normalisedServiceDescription.includes(normalisedSearchTerm) ||
        words.some(word => normalisedDescription.includes(word))
      );
    });

    return item;
  });
};

export { getSearchResults };
