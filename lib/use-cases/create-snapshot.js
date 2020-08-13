import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateSnapshot {
  constructor({ snapshotGateway }) {
    this.snapshotGateway = snapshotGateway;
  }

  async execute({ createdBy, dob, firstName, lastName, systemIds, postcode }) {
    const isoDob = convertObjectToIsoDate(dob);

    const snapshot = await this.snapshotGateway.create({
      createdBy,
      dob: isoDob,
      firstName,
      lastName,
      systemIds,
      postcode
    });

    return {
      id: snapshot.id,
      firstName: snapshot.firstName,
      lastName: snapshot.lastName
    };
  }
}
