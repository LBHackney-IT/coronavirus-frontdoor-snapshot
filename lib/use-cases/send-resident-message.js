export default class SendResidentMessage {
  constructor({ notifyGateway, referralGateway, logger }) {
    this.referralGateway = referralGateway;
    this.notifyGateway = notifyGateway;
  }

  async execute({ id, sendBySms }) {
    const referral = this.referralGateway.get({ id });

    const personalisation = {
      name: referral.resident.name,
      serviceName: referral.service.name,
      referrerName: referral.referrer.name
    };

    if (sendBySms) {
      await this.notifyGateway.sendSms(
        process.env.REFERRAL_RESIDENT_STATUS_SMS_TEMPLATE_ID,
        referral.resident.phone,
        personalisation
      );
    }
  }
}
