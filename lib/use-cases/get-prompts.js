export default class GetPrompts {
  constructor({ promptsGateway, tableName }) {
    this.promptsGateway = promptsGateway;
    this.tableName = tableName;
  }

  async execute() {
    return await this.promptsGateway.getTable(this.tableName);
  }
}
