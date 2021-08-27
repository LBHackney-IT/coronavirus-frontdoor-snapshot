import {
  getSearchResults,
  getWordsToHighlight,
  filterByCategories,
  weightByCategories
} from 'lib/utils/search';

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
    },
    {
      description: 'Category 2',
      id: 2,
      name: 'Cat2',
      resources: [
        {
          id: 8,
          name: 'I am only in 1 category',
          description: 'Gandalf',
          demographic: 'Wizard'
        },
        {
          id: 4,
          name: 'tasty cake',
          description: 'likes lego biscuit'
        }
      ]
    }
  ];

  const excludeTestsServices = [
    {
      description: 'Category description',
      id: 1,
      name: 'Loneliness',
      resources: [
        {
          id: 1,
          name: 'giant ostrich',
          description: 'Big Orc mrzombie',
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

  describe('category filters', () => {
    it('returns everything if no categories selected', () => {
      const filteredServices = filterByCategories([], allServices);

      expect(filteredServices[0].resources.length).toBe(4);
    });
    it('filters by selected categories', () => {
      const filteredByCatId1 = filterByCategories([1], allServices);
      const filteredByCatId3 = filterByCategories([3], allServices);

      expect(filteredByCatId1[0].id).toBe(1);
      expect(filteredByCatId3.length).toBe(0);
    });
  });

  describe('ordering by weight within category', () => {
    it('weights services lower if they provide for unselected categories', () => {
      const weightedResults = weightByCategories([1], allServices);
      const onlyExistsInSelectedCategory = weightedResults[0].resources.filter(x => x.id === 1)[0];
      const existsInSelectedAndUnselectedCategory = weightedResults[1].resources.filter(
        x => x.id === 4
      )[0];

      expect(onlyExistsInSelectedCategory.weight).toBe(100);
      expect(existsInSelectedAndUnselectedCategory.weight).toBe(80);
    });

    it('weights services higher if they exist in multiple selected categories', () => {
      const weightedResults = weightByCategories([1, 2], allServices);
      const existsInOneSelectedCategory = weightedResults[0].resources.filter(x => x.id === 1)[0];
      const existsInBothSelectedCategories = weightedResults[1].resources.filter(
        x => x.id === 4
      )[0];

      expect(existsInBothSelectedCategories.weight).toBe(100);
      expect(existsInOneSelectedCategory.weight).toBe(50);
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

  describe('get words to highlight', () => {
    it('returns words that would need to be highlighted based on the search term', () => {
      const searchText = 'i and domestic testsynonym';
      const toHighlight = getWordsToHighlight(searchText);

      expect(toHighlight).toStrictEqual([
        'i and domestic testsynonym',
        'I And Domestic Testsynonym',
        'I AND DOMESTIC TESTSYNONYM',
        'domestic',
        'testsynonym',
        'Domestic',
        'Testsynonym',
        'DOMESTIC',
        'TESTSYNONYM',
        'ostrich',
        'Ostrich',
        'OSTRICH'
      ]);
    });

    it('only returns one word searches once', () => {
      const searchText = 'domestic';
      const toHighlight = getWordsToHighlight(searchText);

      expect(toHighlight).toStrictEqual(['domestic', 'Domestic', 'DOMESTIC']);
    });
  });

  describe('search exclusions', () => {
    it('excludes results containing terms configured to be excluded', () => {
      const searchText = '';
      const filteredServices = getSearchResults(searchText, excludeTestsServices);
      expect(filteredServices[0].resources.length).toBe(3);
      expect(filteredServices[0].resources.filter(x => x.name == 'giant ostrich').length).toEqual(
        0
      );
    });

    it('ignores excluded words if the user searches for one of them', () => {
      const searchText = 'mrzombie';
      const filteredServices = getSearchResults(searchText, excludeTestsServices);

      expect(filteredServices[0].resources.length).toBe(1);
      expect(filteredServices[0].resources.filter(x => x.name == 'giant ostrich').length).toEqual(
        1
      );
    });
  });
});
