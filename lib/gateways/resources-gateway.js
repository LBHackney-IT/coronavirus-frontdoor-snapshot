import Airtable from 'airtable';
import { createResourceFromModel } from './models/createResourceFromModel';

class ResourcesGateway {
  constructor({ apiKey, baseId, baseUrl, tableNames }) {
    this.tableNames = tableNames;
    console.log("AIRTABLE_BASE_ID is " + baseId)
    // this.tables = new Airtable({ apiKey }).base(baseId);
    this.tables = new Airtable({ apiKey: apiKey, endpointUrl: baseUrl}).base(baseId);
  }

  async all() {
    const results = await Promise.all(
      this.tableNames.map(table => {
        return this.tables(table).select().all();
      })
    );

    return results.flat().map(createResourceFromModel);
  }
}

export default ResourcesGateway;
