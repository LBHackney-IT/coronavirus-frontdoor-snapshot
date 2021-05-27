import { getSearchResults } from 'lib/utils/search';

describe('search', () => {
  it.only('returns items where the search text is found in the description', () => {
    const allServices = [
      {
        description: 'Category description',
        id: 1,
        name: 'Loneliness',
        resources: [
          {
            id: 1,
            name: 'I am a service',
            description: 'I am some search text'
          },
          {
            id: 2,
            name: 'I am not a service',
            description: 'I am not some search text'
          }
        ]
      }
    ];

    const filteredServices = getSearchResults('I am some search text', allServices);
    expect(filteredServices[0].resources.length).toBe(1);
    expect(filteredServices[0].resources.id).toBe(1);
  });
});
