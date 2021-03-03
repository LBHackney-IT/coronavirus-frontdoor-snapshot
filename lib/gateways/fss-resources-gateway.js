const fetch = require('node-fetch');
import Resource from 'lib/domain/resource';
import Taxonomy from 'lib/domain/taxonomy';

class FssResourcesGateway {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async all() {
    try {
      const fssResources = await this.getResources();
      const fssTaxonomies = await this.getTaxonomies();

      return { fssResources, fssTaxonomies };
    } catch (err) {
      console.log('error', err);
      return [];
      // throw new HttpStatusError(response.status);
    }
  }

  async getTaxonomies() {
    const response = await fetch(`${this.baseUrl}/taxonomies`);

    if (response.ok) {
      let results = await Promise.resolve(response.json());
      const fssTaxonomies = results.taxonomies.map(taxonomy => {
        return new Taxonomy({
          id: taxonomy.id,
          name: taxonomy.name,
          description: taxonomy.description
        });
      });

      return fssTaxonomies;
    } else {
      console.log('error', response.status);
      return [];
      // throw new HttpStatusError(response.status);
    }
  }

  async getResources() {
    const response = await fetch(`${this.baseUrl}/services`);

    if (response.ok) {
      let results = await Promise.resolve(response.json());
      const categorisedResults = results.services.map(res => {
        return res.categories.map(category => {
          return new Resource({
            id: res.id,
            name: res.name,
            description: category.description,
            websites: [res.contact.website],
            address: res.locations[0]?.address1,
            postcode: res.locations[0]?.postalCode,
            tags: res.categories.map(c => c.name),
            telephone: res.contact.telephone,
            coordinates: `${res.locations[0]?.latitude},${res.locations[0]?.longitude}`,
            email: res.contact.email,
            referralContact: res.referral.email,
            categoryId: category.id,
            serviceDescription: res.description,
            categoryName: category.name
          });
        });
      });

      const fssResources = [].concat.apply([], categorisedResults);
      return fssResources;
    } else {
      console.log('error', response.status);
      return [];
      // throw new HttpStatusError(response.status);
    }
  }
}

export default FssResourcesGateway;
