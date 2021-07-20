import GetReferralByLinkId from 'lib/use-cases/get-referral-by-link-id';

describe('Get Referral by Link Id use case', () => {
  const logger = { info: jest.fn(), error: jest.fn() };

  it('gets a referral with linkId', async () => {
    const linkId = 'abc123';
    const referral = { linkId };
    const referralGateway = {
      getReferralByLinkId: jest.fn(() => referral)
    };

    const getReferralByLinkId = new GetReferralByLinkId({ referralGateway, logger });
    const result = await getReferralByLinkId.execute({ linkId });

    expect(referralGateway.getReferralByLinkId).toHaveBeenCalledWith({ linkId });
    expect(result).toEqual(referral);
  });

  it('returns null if referral does not exist', async () => {
    const referralGateway = {
      getReferralByLinkId: jest.fn(() => null)
    };

    const getReferralByLinkId = new GetReferralByLinkId({ referralGateway, logger });
    const result = await getReferralByLinkId.execute({ linkId: 1 });
    expect(result).toEqual(null);
  });
});
