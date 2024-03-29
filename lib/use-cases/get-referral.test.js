import GetReferral from 'lib/use-cases/get-referral';
import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');

describe('Get Referral use case', () => {
  const logger = { info: jest.fn(), error: jest.fn() };

  it('gets a referral with id', async () => {
    const id = 1;
    const referral = { id };
    const referralGateway = {
      getByIdForAuthorisedEmail: jest.fn(() => referral)
    };

    jwt.verify.mockReturnValue({ email: 'mock' });

    const getReferral = new GetReferral({ referralGateway, logger });
    const result = await getReferral.execute({ id }, 'hackneyToken=abc');

    expect(referralGateway.getByIdForAuthorisedEmail).toHaveBeenCalledWith({ id, email: 'mock' });
    expect(result).toEqual(referral);
  });

  it('returns null if referral does not exist', async () => {
    const referralGateway = {
      getByIdForAuthorisedEmail: jest.fn(() => null)
    };

    const getReferral = new GetReferral({ referralGateway, logger });
    const result = await getReferral.execute({ id: 1 });
    expect(result).toEqual(null);
  });
});
