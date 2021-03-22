import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateReferral {
  constructor({
    referralGateway,
    sendReferralEmail,
    sendReferralReceiptEmail,
    sendResidentReferralSms
  }) {
    this.referralGateway = referralGateway;
    this.sendReferralEmail = sendReferralEmail;
    this.sendReferralReceiptEmail = sendReferralReceiptEmail;
    this.sendResidentReferralSms = sendResidentReferralSms;
  }

  async execute(
    {
      resident,
      referrer,
      referralReason,
      conversationNotes,
      service,

      systemIds = []
    },
    sendResidentSms,
    sendResidentEmail
  ) {
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

    let residentReferralSms;
    if (sendResidentSms) {
      residentReferralSms = await this.sendResidentReferralSms.execute({
        name: `${resident.firstName} ${resident.lastName}`,
        referrerOrganisation: referrer.organisation,
        serviceName: service.name,
        serviceContactPhone: service.contactPhone,
        serviceAddress: service.address,
        serviceWebsites: service.websites
      });

      if (residentReferralSms.response.status > 201) {
        errors.push('Failed to send referral sms to resident');
      }
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
        residentReferralSmsId: residentReferralSms?.response.data?.id
      }
    });

    return {
      id: referral.id,
      errors: errors
    };
  }
}
