import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({ referralGateway, sendReferralEmail }) {
    this.referralGateway = referralGateway;
    this.sendReferralEmail = sendReferralEmail;
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

    const referral_email = await this.sendReferralEmail.execute({
      email: referral.email,
      referral: {
        name: referral.firstName,
        phone: referral.phone,
        email: referral.email,
        referralReason: referral.referralReason,
        conversationNotes: referral.conversationNotes,
        referrerName: referral.createdBy,
        referrerOrganisation: referral.referrerOrganisation,
        referrerEmail: referral.referrerEmail
      }
    });

    const errors = [];

    if (referral_email.response.status > 201) {
      errors.push('Failed to send referral email to service');
    }

    console.log(referral_email.response.status);
    return {
      id: referral.id,
      firstName: referral.firstName,
      lastName: referral.lastName,
      errors: errors
    };
  }
}
