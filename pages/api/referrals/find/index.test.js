import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Find Referrals Api', () => {
  const findReferrals = { execute: jest.fn(() => ({ referralIds: [1, 2] })) };
  const call = async ({ method, body, headers }) => {
    const response = createMockResponse();
    await endpoint({ findReferrals })(
      {
        method: method || 'POST',
        body,
        headers
      },
      response
    );
    return response;
  };

  it('can find referrals', async () => {
    const response = await call({
      body: { findBy: 'referrerEmail' },
      headers: { cookie: 'hackneyToken=abc' }
    });

    expect(findReferrals.execute).toHaveBeenCalledWith(
      {
        findBy: 'referrerEmail'
      },
      'hackneyToken=abc'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ referralIds: [1, 2] }));
  });

  it('does not accept non-POST requests', async () => {
    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(405);
  });

  describe('validation', () => {
    it('returns 400 when no referrerEmail', async () => {
      const response = await call({
        body: {}
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors.length).toBe(1);
    });
  });

  it('returns a 500 for other errors', async () => {
    findReferrals.execute = jest.fn(() => {
      throw new Error();
    });
    const response = await call({
      body: {
        findBy: 'referrerEmail'
      }
    });
    expect(response.statusCode).toBe(500);
  });
});
