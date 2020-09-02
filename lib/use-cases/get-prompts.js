export default class GetPrompts {
  constructor({ resourcesGateway, tableName }) {
    this.resourcesGateway = resourcesGateway;
    this.tableName = tableName;
  }

  async execute() {
    return await this.resourcesGateway.getTable(this.tableName);
  }
}
