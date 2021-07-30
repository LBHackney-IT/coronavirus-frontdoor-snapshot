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
          serviceDescription: 'zebra hybrid cake',
          tags: ['tag1', 'tag2']
        },
        {
          id: 2,
          name: 'I am not a service',
          description: 'I is a service'
        },
        {
          id: 3,
          name: 'I am not a service',
          description: 'Find services biscuit',
          serviceDescription: 'Very good biscuit cheese vendor'
        },
        {
          id: 4,
          name: 'tasty cake',
          description: 'likes lego biscuit'
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
      expect(filteredServices[0].resources[0].serviceDescription).toContain(searchText);
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
    it('returns items where a word in the search text is found in name', () => {
      const searchText = 'ostric monkey';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });

    it('returns items where a word in the search text is found in service description', () => {
      const searchText = 'zebra monkey';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });

    it('returns items where the search text is found in demographics', () => {
      const searchText = 'women panda';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
    });

    it('returns items where the search text is found in tags', () => {
      const searchText = 'tag1';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
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

      expect(filteredServices[0].resources.length).toBe(4);
    });
    it('returns everything if search term consists of whitespace only', () => {
      const searchText = '   ';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(4);
    });
  });

  describe('search ordering', () => {
    describe('ordering of search results', () => {
      it('returns items containing the full phrase before items containing an individual word', () => {
        const searchText = 'i is a service';
        const filteredServices = getSearchResults(searchText, allServices);

        var fullMatchItem = filteredServices[0].resources.filter(x => x.id == 2)[0];
        var wordMatchItem = filteredServices[0].resources.filter(x => x.id == 3)[0];

        expect(fullMatchItem.weight).toBe(125);
        expect(wordMatchItem.weight).toBe(50);
      });
      it('weights a title match higher than a content match for individual words', () => {
        const searchText = 'cake';
        const filteredServices = getSearchResults(searchText, allServices);

        var titleMatchItem = filteredServices[0].resources.filter(x => x.id == 4)[0];
        var contentMatchItem = filteredServices[0].resources.filter(x => x.id == 1)[0];

        expect(titleMatchItem.weight).toBe(125);
        expect(contentMatchItem.weight).toBe(100);
      });
      it('gives a higher weight if multiple words are found compared to one word found', () => {
        const searchText = 'biscuit cheese';
        const filteredServices = getSearchResults(searchText, allServices);

        var multipleMatchItem = filteredServices[0].resources.filter(x => x.id == 3)[0];
        var singleMatchItem = filteredServices[0].resources.filter(x => x.id == 4)[0];

        expect(multipleMatchItem.weight).toBe(125);
        expect(singleMatchItem.weight).toBe(25);
      });
      it('returns only items with a weight higher than zero', () => {
        const searchText = 'sdjkfhdsjkfhsdkf';
        const filteredServices = getSearchResults(searchText, allServices);

        expect(filteredServices[0].resources.length).toBe(0);
      });
    });
  });

  describe('synonym search', () => {
    it('returns a record with weight of 30 if it was matched on a synonym', () => {
      const searchText = 'testsynonym';
      const filteredServices = getSearchResults(searchText, allServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources[0].id).toEqual(1);
      expect(filteredServices[0].resources[0].weight).toBe(30);
    });
  });
});
