export default class FindReferrals {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
  }

  async execute(request) {
    console.log('Looking for referrals with request: ', request);
    return await this.referralGateway.find(request);
  }
}
