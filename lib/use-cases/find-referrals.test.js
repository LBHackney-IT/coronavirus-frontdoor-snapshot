import FindReferrals from 'lib/use-cases/find-referrals';
import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');

describe('Find Referrals use case', () => {
  it('can find matching referrals', async () => {
    const referralGateway = { find: jest.fn() };
    const findReferrals = new FindReferrals({ referralGateway });
    jwt.verify.mockReturnValue({ email: 'mock' });

    const findReferralsRequest = {
      findBy: 'referrerEmail'
    };

    await findReferrals.execute(findReferralsRequest, 'hackneyToken=abc');
    expect(referralGateway.find).toHaveBeenCalledWith({ referrerEmail: 'mock' });
  });
});
