import { getTokenFromCookieHeader } from 'lib/utils/token';
import jsonwebtoken from 'jsonwebtoken';

export default class FindReferrals {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
  }

  async execute(request, cookie) {
    if (request.findBy == 'referrerEmail') {
      const token = getTokenFromCookieHeader({ cookie });
      const { email } = jsonwebtoken.decode(token);

      console.log('Looking for referrals with request: ', request, ': ', email);
      return await this.referralGateway.find({ referrerEmail: email });
    }
    return [];
  }
}
