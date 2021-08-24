export default class SendResidentMessage {
  constructor({ notifyGateway, referralGateway, logger }) {
    this.referralGateway = referralGateway;
    this.notifyGateway = notifyGateway;
    this.logger = logger;
  }

  async execute({ id, sendBySms }) {
    try {
      const referral = this.referralGateway.get({ id });

      if (referral == null) {
        this.logger.error('No referral found by Id', { id });
        return null;
      }
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

        this.referralGateway.update({
          id: referral.id,
          emails: { ...referral.emails, residentStatusChangeSmsId: residentSms?.response.data?.id }
        });
      }
    } catch (err) {
      this.logger.error('Error sending the status change message to the resident.', { id, err });
    }
  }
}
