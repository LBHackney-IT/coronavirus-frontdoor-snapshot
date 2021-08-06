import { getTokenFromCookieHeader } from 'lib/utils/token';
import CheckAuth from 'router/use-cases/check-auth';

export default class FindReferrals {
  constructor({ referralGateway }) {
    this.referralGateway = referralGateway;
  }

  async execute(request, cookie) {
    if (request.findBy == 'referrerEmail') {
      const token = getTokenFromCookieHeader({ cookie });

      const checkAuth = new CheckAuth({});
      const email = checkAuth.getEmail(token);

      console.log('Looking for referrals with request: ', request, ': ', email);
      return await this.referralGateway.find({ referrerEmail: email });
    }
    return [];
  }
}
