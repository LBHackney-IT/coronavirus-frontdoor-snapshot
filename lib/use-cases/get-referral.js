import { getTokenFromCookieHeader } from 'lib/utils/token';
import CheckAuth from 'router/use-cases/check-auth';

export default class GetReferral {
  constructor({ referralGateway, logger }) {
    this.referralGateway = referralGateway;
    this.logger = logger;
  }

  async execute({ id }, cookie) {
    const token = getTokenFromCookieHeader({ cookie });

    const checkAuth = new CheckAuth({});
    const email = checkAuth.getEmail(token);

    const referral = await this.referralGateway.getByIdForAuthorisedEmail({ id, email });

    if (!referral) {
      this.logger.error('No referral found', { id });
      return null;
    }

    return referral;
  }
}
