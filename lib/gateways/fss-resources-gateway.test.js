import FssResourcesGateway from './fss-resources-gateway';
import nock from 'nock';

describe('FssResourcesGateway', () => {
  const expectedBaseUrl = 'https://localhost:3000';

  const taxonomies = nock(expectedBaseUrl).get('/taxonomies').once().reply(200, { taxonomies: [] });

  const services = nock(expectedBaseUrl).get('/services').once().reply(200, { services: [] });

  const gateway = new FssResourcesGateway({
    baseUrl: expectedBaseUrl
  });

  describe('#taxonomies', () => {
    it('requests taxonomies', async () => {
      await gateway.getTaxonomies();
      expect(taxonomies.isDone()).toBe(true);
    });
  });

  describe('#resources', () => {
    it('requests the resources/services', async () => {
      await gateway.getResources();
      expect(services.isDone()).toBe(true);
    });
  });

  describe('#all', () => {
    it('requests the resources and taxonomies', async () => {
      await gateway.all();
      expect(services.isDone()).toBe(true);
    });
  });
});
