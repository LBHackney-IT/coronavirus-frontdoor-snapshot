export default class UpdateReferral {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
  }

  async execute({ referral }) {
    await this.referralGateway.update({ referral });
  }
}
