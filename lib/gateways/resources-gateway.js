import Airtable from 'airtable';
import { createResourceFromModel } from './models/createResourceFromModel';

class ResourcesGateway {
  constructor({ apiKey, baseId, baseUrl, tableNames }) {
    this.tableNames = tableNames;
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
  async getTable(tableName) {
    const result = await Promise.resolve(
      this.tables(tableName).select().all()
    )
    return result.flat().map(createResourceFromModel);
  }
}

export default ResourcesGateway;
