import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateSnapshot {
  constructor({ snapshotGateway }) {
    this.snapshotGateway = snapshotGateway;
  }

  async execute({
    createdBy,
    dob,
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes
  }) {
    const isoDob = convertObjectToIsoDate(dob);

    const snapshot = await this.snapshotGateway.create({
      dob: isoDob,
      createdBy,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes
    });

    return {
      id: snapshot.id,
      firstName: snapshot.firstName,
      lastName: snapshot.lastName
    };
  }
}
