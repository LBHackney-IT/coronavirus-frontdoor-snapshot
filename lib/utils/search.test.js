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
          name: 'I am a service',
          description: 'Big Orc'
        },
        {
          id: 2,
          name: 'I am not a service',
          description: 'I am a service'
        },
        {
          id: 3,
          name: 'I am not a service',
          description: 'Find service'
        }
      ]
    }
  ];

  it('returns items where the search text is found in the description', () => {
    const searchText = 'Big Orc';
    const filteredServices = getSearchResults(searchText, allServices);

    expect(filteredServices[0].resources.length).toBe(1);
    expect(filteredServices[0].resources[0].description).toEqual(searchText);
  });

  it('returns items where a word in the search text is found in the description', () => {
    const searchText = 'Find service';
    const filteredServices = getSearchResults(searchText, allServices);

    // expect(filteredServices).toBe(2);
    expect(filteredServices[0].resources.length).toBe(2);
  });
});
