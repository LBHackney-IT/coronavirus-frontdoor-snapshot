import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
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

    const referral = await this.referralGateway.create({
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
      id: referral.id,
      firstName: referral.firstName,
      lastName: referral.lastName
    };
  }
}
