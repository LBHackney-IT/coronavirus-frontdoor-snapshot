import { normalise } from './normalise';
import { removeCommonWords } from 'lib/utils/searchHelper';

const getSearchResults = (searchTerm, items) => {
  let normalisedSearchTerm = normalise(searchTerm.trim());
  let words = removeCommonWords(normalisedSearchTerm.split(' '));

  return JSON.parse(JSON.stringify(items)).map(item => {
    item.resources = item.resources.filter(resource => {
      const normalisedFields = {
        name: resource.name ? normalise(resource.name) : '',
        description: resource.description ? normalise(resource.description) : '',
        demographic: resource.demographic ? normalise(resource.demographic) : '',
        serviceDescription: resource.serviceDescription
          ? normalise(resource.serviceDescription)
          : ''
      };

      return (
        Object.values(normalisedFields).some(x => x.includes(normalisedSearchTerm))||
        words.some(word => normalisedFields.description.includes(word))
      );
    });

    return item;
  });
};

export { getSearchResults };
