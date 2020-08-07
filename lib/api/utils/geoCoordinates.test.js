import geoCoordinates from './geoCoordinates';
import fetchMock from 'jest-fetch-mock';

describe('geoCoordinates', () => {
  const utility = geoCoordinates;

  fetchMock.enableMocks();

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('fetches the geographical coordinates from a postcode', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          address: [
            {
              latitude: '51.5433',
              longitude: '-0.0456'
            }
          ]
        }
      })
    );

    const coordinates = await utility('E1 6AW');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(coordinates).toEqual({
      lat: '51.5433',
      long: '-0.0456'
    });
  });


  it('fetches the geographical coordinates from a postcode, but API is down', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    const coordinates = await utility('E1 6AW');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(coordinates).toBeUndefined();
  });

});
