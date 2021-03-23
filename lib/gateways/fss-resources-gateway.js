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

      return {
        data: {
          fssResources: fssResources.data,
          fssTaxonomies: fssTaxonomies.data
        },
        error: [fssTaxonomies.error, fssResources.error]
      };
    } catch (err) {
      console.log('Error getting FSS resources and Taxonomies', err);
      return {
        data: { fssResources: [], fssTaxonomies: [] },
        error: 'Error getting FSS resources and Taxonomies'
      };
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

      return { data: fssTaxonomies };
    } else {
      console.log('Error getting FSS taxonomies', response.status);
      return { data: [], error: 'Error getting FSS taxonomies' };
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
            address: [
              res.locations[0]?.address1,
              res.locations[0]?.address2,
              res.locations[0]?.city
            ].join(', '),
            postcode: res.locations[0]?.postalCode,
            tags: res.categories.map(c => c.name),
            telephone: res.contact.telephone,
            coordinates: `${res.locations[0]?.latitude},${res.locations[0]?.longitude}`,
            email: res.contact.email,
            referralContact: res.referral.email,
            referralWebsite: res.referral.website,
            categoryId: category.id,
            serviceDescription: res.description,
            categoryName: category.name,
            demographic: res.demographic?.map(x => x.name).join(', ')
          });
        });
      });

      const fssResources = [].concat.apply([], categorisedResults);
      return { data: fssResources };
    } else {
      console.log('Error getting FSS resources', response.status);
      return { data: [], error: 'Error getting FSS resources' };
    }
  }
}

export default FssResourcesGateway;
