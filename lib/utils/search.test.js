import { getSearchResults } from 'lib/utils/search';

describe('search', () => {
  const allServices = [
    {
      description: 'Category description',
      id: 1,
      name: 'Loneliness',
      resources: [
        {
          id: 1,
          name: 'giant ostrich',
          description: 'Big Orc',
          demographic: 'Men, Women',
          serviceDescription: 'zebra hybrid'
        },
        {
          id: 2,
          name: 'I am not a service',
          description: 'I is a service'
        },
        {
          id: 3,
          name: 'I am not a service',
          description: 'Find services'
        }
      ]
    }
  ];
  describe('full term search', () => {
    it('returns items where the search text is found in the description', () => {
      const searchText = 'Big Orc';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].description).toEqual(searchText);
    });

    it('returns items where the search text is found in name', () => {
      const searchText = 'giant ostrich';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].name).toEqual(searchText);
    });

    it('returns items where the search text is found in service description', () => {
      const searchText = 'zebra hybrid';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].serviceDescription).toEqual(searchText);
    });

    it('returns items where the search text is found in demographics', () => {
      const searchText = 'women';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });

    it('applies a case insensitive search', () => {
      const searchTextLower = 'big orc';
      const filteredServicesLower = getSearchResults(searchTextLower, allServices);

      expect(filteredServicesLower[0].resources.length).toBe(1);
      expect(filteredServicesLower[0].resources[0].id).toEqual(1);

      const searchTextUpper = 'BIG ORC';
      const filteredServicesUpper = getSearchResults(searchTextUpper, allServices);

      expect(filteredServicesUpper[0].resources.length).toBe(1);
      expect(filteredServicesUpper[0].resources[0].id).toEqual(1);
    });
  });

  describe('individual word search', () => {
    it('returns items where a word in the search text is found in the description', () => {
      const searchText = 'Find service';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(2);
    });
    it('applies a case insensitive search', () => {
      const searchTextLower = 'find';
      const filteredServicesLower = getSearchResults(searchTextLower, allServices);

      expect(filteredServicesLower[0].resources.length).toBe(1);
      expect(filteredServicesLower[0].resources[0].id).toEqual(3);

      const searchTextUpper = 'FIND';
      const filteredServicesUpper = getSearchResults(searchTextUpper, allServices);

      expect(filteredServicesUpper[0].resources.length).toBe(1);
      expect(filteredServicesUpper[0].resources[0].id).toEqual(3);
    });
    it('ignores 1 character letters, numbers or symbols', () => {
      const searchText = 'a big orc';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });
    it('ignores common conjunctions', () => {
      const searchText = 'i is a big orc';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });
  });

  describe('empty search', () => {
    it('returns everything if search term is an empty string', () => {
      const searchText = '';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(3);
    });
    it('returns everything if search term consists of whitespace only', () => {
      const searchText = '   ';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(3);
    });
  });
});
