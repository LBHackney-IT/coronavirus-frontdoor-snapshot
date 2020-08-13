import Resource from 'domain/resource';
import ResourcesGateway from './resources-gateway';
import nock from 'nock';

describe('ResourcesGateway', () => {
  const expectedApiKey = 'keyXXXXXXXXXXXX';
  const expectedBaseId = 'appaXXXXXXXXXXX';
  const expectedTableName = 'example-table-name';
  const expectedBaseUrl = 'https://api.airtable.com';

  describe('#all', () => {
    it('sets correct headers and parameters for API calls', async () => {
      const airtable = nock(/api.airtable.com/)
        .get(new RegExp(`${expectedBaseId}/${expectedTableName}.*$`))
        .matchHeader('authorization', `Bearer ${expectedApiKey}`)
        .reply(200, { records: [] });

      const gateway = new ResourcesGateway({
        apiKey: expectedApiKey,
        baseId: expectedBaseId,
        baseUrl: expectedBaseUrl,
        tableNames: [expectedTableName]
      });

      await gateway.all();
      expect(airtable.isDone()).toBe(true);
    });

    it('retrieves resources from all specified tables', async () => {
      const airtable = nock(/api.airtable.com/)
        .get(/.*/)
        .twice()
        .reply(200, { records: [] });

      const gateway = new ResourcesGateway({
        apiKey: expectedApiKey,
        baseId: expectedBaseId,
        baseUrl: expectedBaseUrl,
        tableNames: ['first', 'second']
      });

      await gateway.all();
      expect(airtable.isDone()).toBe(true);
    });

    it('maps Airtable records into resources', async () => {
      const airtable = nock(/api.airtable.com/)
        .get(/.*/)
        .reply(200, {
          records: [
            {
              id: 'xxx',
              fields: {
                Name: 'Resource name',
                Description: 'This is a description',
                'Website 1': 'https://www.example.com',
                'Website 2': 'https://www.example.org',
                Address: '42 Wallaby Way, Sydney, S1',
                Postcode: 'S1',
                Tags: ['one', 'two', 'three']
              }
            }
          ]
        });

      const gateway = new ResourcesGateway({
        apiKey: expectedApiKey,
        baseId: expectedBaseId,
        baseUrl: expectedBaseUrl,
        tableNames: [expectedTableName]
      });

      const results = await gateway.all();
      results.every(result => expect(result).toBeInstanceOf(Resource));
    });
  });
});
