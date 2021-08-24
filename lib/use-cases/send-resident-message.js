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

    let residentSms;
    if (sendBySms) {
      residentSms = await this.notifyGateway.sendSms(
        process.env.REFERRAL_RESIDENT_STATUS_SMS_TEMPLATE_ID,
        referral.resident.phone,
        personalisation
      );
    }

    this.referralGateway.update({
      referral: {
        id: referral.id,
        emails: { ...referral.emails, residentStatusChangeSmsId: residentSms?.response.data?.id }
      }
    });
  }
}
