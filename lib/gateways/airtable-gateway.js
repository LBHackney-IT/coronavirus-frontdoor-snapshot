import Airtable from 'airtable';
import { createResourceFromModel } from './models/createResourceFromModel';

class AirtableGateway {
  constructor({ apiKey, baseId, baseUrl, tableNames }) {
    this.tableNames = tableNames;
    // this.tables = new Airtable({ apiKey }).base(baseId);
    this.tables = new Airtable({ apiKey: apiKey, endpointUrl: baseUrl }).base(baseId);
  }

  async all() {
    try {
      const results = await Promise.all(
        this.tableNames.map(table => {
          return this.tables(table).select().all();
        })
      );

      let categorisedResources = [];

      results.flat().forEach(result =>
        result.fields.Categories?.forEach(category => {
          categorisedResources.push({ ...result, categoryName: category });
        })
      );

      return { data: categorisedResources.map(createResourceFromModel) };
    } catch (err) {
      console.log('Error fetching resources', err);
      return { data: [], error: 'Error fetching resources' };
    }
  }
}

export default AirtableGateway;
