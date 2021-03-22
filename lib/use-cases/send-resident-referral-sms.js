export default class SendResidentReferralSms {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ phoneNumber, referral }) {
    const personalisation = {
      name: referral.name,
      referrerOrganisation: referral.referrerOrganisation,
      serviceName: referral.serviceName,
      serviceContactPhone: referral.serviceContactPhone,
      serviceAddress: referral.serviceAddress,
      serviceWebsite: referral.serviceWebsite
    };

    return await this.notifyGateway.sendSms(
      process.env.REFERRAL_RESIDENT_SMS_TEMPLATE_ID,
      phoneNumber,
      personalisation
    );
  }
}
