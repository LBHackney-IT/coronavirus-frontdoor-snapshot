import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({
    referralGateway,
    sendReferralEmail,
    sendReferralReceiptEmail,
    sendReferralResidentEmail
  }) {
    this.referralGateway = referralGateway;
    this.sendReferralEmail = sendReferralEmail;
    this.sendReferralReceiptEmail = sendReferralReceiptEmail;
    this.sendReferralResidentEmail = sendReferralResidentEmail;
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

    const referral_email = await this.sendReferralEmail.execute({
      emailAddress: service.referralEmail,
      referral: {
        name: `${resident.firstName} ${resident.lastName}`,
        phone: resident.phone,
        email: resident.email,
        referralReason: referralReason,
        conversationNotes: conversationNotes,
        referrerName: referrer.name,
        referrerOrganisation: referrer.organisation,
        referrerEmail: referrer.email
      }
    });
    const errors = [];

    if (referral_email.response.status > 201) {
      errors.push('Failed to send referral email to service');
    }

    const referral_receipt_email = await this.sendReferralReceiptEmail.execute({
      emailAddress: service.referralEmail,
      referral: {
        name: `${resident.firstName} ${resident.lastName}`,
        phone: resident.phone,
        email: resident.email,
        referralReason: referralReason,
        conversationNotes: conversationNotes,
        serviceName: service.name,
        serviceReferralEmail: service.referralEmail,
        serviceContactPhone: service.contactPhone,
        serviceContactEmail: service.contactEmail
      }
    });

    if (referral_receipt_email.response.status > 201) {
      errors.push('Failed to send referral email receipt to referer');
    }

    const referral_resident_email = await this.sendReferralResidentEmail.execute({
      emailAddress: service.referralEmail,
      referral: {
        name: resident.firstName,
        email: resident.email,
        serviceName: service.name,
        serviceContactPhone: service.contactPhone,
        serviceContactEmail: service.contactEmail,
        serviceWebsite: service.website,
        serviceAddress: service.address,
        referrerName: referrer.name,
        referrerOrganisation: referrer.organisation
      }
    });

    if (referral_resident_email.response.status > 201) {
      errors.push('Failed to send referral email receipt to resident');
    }

    const referral = await this.referralGateway.create({
      resident,
      referrer,
      referralReason,
      conversationNotes,
      service,
      systemIds,
      emails: {
        referralEmailId: referral_email.response.data?.id,
        referralReceiptEmailId: referral_receipt_email.response.data?.id,
        referralResidentEmail: referral_resident_email.response.data?.id
      }
    });

    return {
      id: referral.id,
      errors: errors
    };
  }
}
