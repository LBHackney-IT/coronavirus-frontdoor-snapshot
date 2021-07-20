export default class GetReferralByLinkId {
  constructor({ referralGateway, logger }) {
    this.referralGateway = referralGateway;
    this.logger = logger;
  }

  async execute({ linkId }) {
    const referral = await this.referralGateway.getByLinkId({ linkId });

    if (!referral) {
      this.logger.error('No referral found by link Id', { linkId });
      return null;
    }

    return referral;
  }
}
