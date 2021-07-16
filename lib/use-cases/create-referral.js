import { convertObjectToIsoDate, convertIsoDateToString } from 'lib/utils/date';

export default class CreateReferral {
  constructor({
    referralGateway,
    sendReferralEmail,
    sendReferralReceiptEmail,
    sendReferralResidentEmail,
    sendResidentReferralSms
  }) {
    this.referralGateway = referralGateway;
    this.sendReferralEmail = sendReferralEmail;
    this.sendReferralReceiptEmail = sendReferralReceiptEmail;
    this.sendReferralResidentEmail = sendReferralResidentEmail;
    this.sendResidentReferralSms = sendResidentReferralSms;
  }

  async execute(
    { resident, referrer, referralReason, conversationNotes, service, systemIds = [] },
    sendResidentSms = false,
    sendResidentEmail = false
  ) {
    resident.dateOfBirth = convertObjectToIsoDate(resident.dateOfBirth);
    const emailFriendlyDateOfBirth = convertIsoDateToString(resident.dateOfBirth);

    const referral_email = await this.sendReferralEmail.execute({
      emailAddress: service.referralEmail,
      referral: {
        name: `${resident.firstName} ${resident.lastName}`,
        phone: resident.phone,
        email: resident.email,
        dateOfBirth: emailFriendlyDateOfBirth,
        address: `${resident.address} ${resident.postcode}`,
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
      emailAddress: referrer.email,
      referral: {
        name: `${resident.firstName} ${resident.lastName}`,
        phone: `${resident.phone}`,
        email: `${resident.email}`,
        referralReason: referralReason,
        conversationNotes: conversationNotes,
        serviceName: `${service.name}`,
        serviceReferralEmail: `${service.referralEmail}`,
        serviceContactPhone: `${service.contactPhone}`,
        serviceContactEmail: `${service.contactEmail}`
      }
    });

    if (referral_receipt_email.response.status > 201) {
      errors.push('Failed to send referral email receipt to referer');
    }

    let referral_resident_email;
    if (sendResidentEmail) {
      referral_resident_email = await this.sendReferralResidentEmail.execute({
        emailAddress: resident.email,
        referral: {
          name: `${resident.firstName}`,
          serviceName: `${service.name}`,
          serviceContactPhone: `${service.contactPhone}`,
          serviceDescription: `${service.description}`,
          serviceWebsite: `${service.websites}`,
          serviceAddress: `${service.address}`,
          referrerName: `${referrer.name}`,
          referrerOrganisation: `${referrer.organisation}`,
          referrerEmail: `${referrer.email}`
        }
      });

      if (referral_resident_email.response.status > 201) {
        errors.push('Failed to send referral email receipt to resident');
      }
    }

    let residentReferralSms;
    if (sendResidentSms) {
      residentReferralSms = await this.sendResidentReferralSms.execute({
        phoneNumber: resident.phone,
        referral: {
          name: `${resident.firstName}`,
          referrerOrganisation: `${referrer.organisation}`,
          serviceName: `${service.name}`,
          serviceContactPhone: `${service.contactPhone}`,
          serviceAddress: `${service.address}`,
          serviceWebsite: `${service.websites}`
        }
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
        referralResidentEmailId: referral_resident_email?.response.data?.id,
        residentReferralSmsId: residentReferralSms?.response.data?.id
      }
    });

    return {
      id: referral.id,
      errors: errors
    };
  }
}
