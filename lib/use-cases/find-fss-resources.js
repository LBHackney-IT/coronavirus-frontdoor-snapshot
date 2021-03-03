export default class FindResources {
  constructor({ fssResourcesGateway }) {
    this.fssResourcesGateway = fssResourcesGateway;
  }

  async execute() {
    return await this.fssResourcesGateway.all();
  }
}
