export default class FindSnapshots {
  constructor({ snapshotGateway }) {
    this.snapshotGateway = snapshotGateway;
  }

  async execute(request) {
    console.log("Looking for snapshots with request: ", request)
    return await this.snapshotGateway.find(request);
  }
}
