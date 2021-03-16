import GetReferral from 'lib/use-cases/get-referral';

describe('Get Referral use case', () => {
  const logger = { info: jest.fn(), error: jest.fn() };

  it('gets a referral with id', async () => {
    const id = 1;
    const referral = { id };
    const referralGateway = {
      get: jest.fn(() => referral)
    };

    const getReferral = new GetReferral({ referralGateway, logger });
    const result = await getReferral.execute({ id });

    expect(referralGateway.get).toHaveBeenCalledWith({ id });
    expect(result).toEqual(referral);
  });

  it('returns null if referral does not exist', async () => {
    const referralGateway = {
      get: jest.fn(() => null)
    };

    const getReferral = new GetReferral({ referralGateway, logger });
    const result = await getReferral.execute({ id: 1 });
    expect(result).toEqual(null);
  });
});
