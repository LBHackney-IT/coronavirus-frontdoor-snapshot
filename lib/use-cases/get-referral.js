export default class GetReferral {
  constructor({ referralGateway, logger }) {
    this.referralGateway = referralGateway;
    this.logger = logger;
  }

  async execute({ id }) {
    const referral = await this.referralGateway.get({ id });

    if (!referral) {
      this.logger.error('No referral found', { id });
      return null;
    }

    return referral;
  }
}
