import Airtable from 'airtable';
import { createResourceFromModel } from './models/createResourceFromModel';
import { createPromptFromModel } from './models/createPromptFromModel';

class AirtableGateway {
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

    let categorisedResources = [];

    results.flat().forEach(result =>
      result.fields.Categories?.forEach(category => {
        categorisedResources.push({ ...result, categoryName: category, tag: "Council" });
      })
    );

    return categorisedResources.map(createResourceFromModel);
  }
  async getTable(tableName) {
    const result = await Promise.resolve(
      this.tables(tableName).select().all()
    )
    return result.flat().map(createPromptFromModel);
  }
}

export default AirtableGateway;
