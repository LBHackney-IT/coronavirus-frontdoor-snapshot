import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({ referralGateway, sendReferralEmail }) {
    this.referralGateway = referralGateway;
    this.sendReferralEmail = sendReferralEmail;
  }

  async execute({
    resident,
    referrer,
    referralReason,
    conversationNotes,
    service,
    systemIds = []
  }) {
    resident.dateOfBirth = convertObjectToIsoDate(resident.dateOfBirth);

    const referral = await this.referralGateway.create({
      resident,
      referrer,
      referralReason,
      conversationNotes,
      service,
      systemIds
    });

    const referral_email = await this.sendReferralEmail.execute({
      emailAddress: service.referralEmail,
      referral: {
        name: resident.firstName,
        phone: resident.phone,
        email: resident.email,
        referralReason: referral.referralReason,
        conversationNotes: referral.conversationNotes,
        referrerName: referrer.name,
        referrerOrganisation: referrer.organisation,
        referrerEmail: referrer.email
      }
    });

    const errors = [];

    if (referral_email.response.status > 201) {
      errors.push('Failed to send referral email to service');
    }
    // seen to save >> referral_email.response.data.id

    return {
      id: referral.id,
      firstName: referral.firstName,
      lastName: referral.lastName,
      errors: errors
    };
  }
}
