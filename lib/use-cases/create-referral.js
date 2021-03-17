import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
  }

  async execute({
    createdBy,
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes,
    referrerOrganisation,
    referrerEmail,
    dateOfBirth,
    systemIds = []
  }) {
    const isoDob = convertObjectToIsoDate(dateOfBirth);

    const referral = await this.referralGateway.create({
      createdBy,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      referrerOrganisation,
      referrerEmail,
      dateOfBirth: isoDob,
      systemIds
    });

    return {
      id: referral.id,
      firstName: referral.firstName,
      lastName: referral.lastName
    };
  }
}