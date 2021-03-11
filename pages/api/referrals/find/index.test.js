import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Find Referrals Api', () => {
  const findReferrals = { execute: jest.fn(() => ({ referralIds: [1, 2] })) };
  const call = async ({ method, body }) => {
    const response = createMockResponse();
    await endpoint({ findReferrals })(
      {
        method: method || 'POST',
        body
      },
      response
    );
    return response;
  };

  it('can find referrals', async () => {
    const firstName = 'sue';
    const lastName = 'taylor';
    const systemIds = ['xyz'];
    const response = await call({ body: { firstName, lastName, systemIds } });
    expect(findReferrals.execute).toHaveBeenCalledWith({
      firstName,
      lastName,
      systemIds
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ referralIds: [1, 2] }));
  });

  it('does not accept non-POST requests', async () => {
    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(405);
  });

  describe('validation', () => {
    it('returns 400 when no firstName', async () => {
      const response = await call({
        body: {
          lastName: 'taylor',
          systemIds: ['xyz']
        }
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors.length).toBe(1);
    });

    it('returns 400 when no lastName', async () => {
      const response = await call({
        body: {
          firstName: 'sue',
          systemIds: ['xyz']
        }
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
        firstName: 'sue',
        lastName: 'taylor',
        systemIds: ['xyz']
      }
    });
    expect(response.statusCode).toBe(500);
  });
});
