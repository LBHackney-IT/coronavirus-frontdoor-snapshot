import FindReferrals from 'lib/use-cases/find-referrals';

describe('Find Referrals use case', () => {
  it('can find matching referrals', async () => {
    const referralGateway = { find: jest.fn() };
    const findReferrals = new FindReferrals({ referralGateway });

    const findReferralsRequest = {
      firstName: 'Joe',
      lastName: 'Bro',
      systemIds: ['123']
    };

    await findReferrals.execute(findReferralsRequest);
    expect(referralGateway.find).toHaveBeenCalledWith(findReferralsRequest);
  });
});
