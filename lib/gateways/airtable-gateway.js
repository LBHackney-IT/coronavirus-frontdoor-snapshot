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
    try{
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
    } catch (err){
      console.log("Error fetching resources", err);
      return [];
    }
  }
  async getTable(tableName) {
    try {
      const result = await Promise.resolve(
        this.tables(tableName).select().all()
      )
      return result.flat().map(createPromptFromModel);
    } 
    catch (err) {
      console.log("Error fetching prompts", err);
      return [];
    }
  }
}

export default AirtableGateway;
