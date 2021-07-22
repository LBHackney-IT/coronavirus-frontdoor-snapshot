import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Update Referral Status Api', () => {
  const id = '1';
  const updateReferralStatus = { execute: jest.fn(() => ({ id })) };
  const call = async ({ body, method, params }) => {
    const response = createMockResponse();
    await endpoint({ updateReferralStatus })(
      {
        body,
        query: params,
        method
      },
      response
    );
    return response;
  };

  describe('Update', () => {
    it('can update a referral status', async () => {
      const referral = { id: 1 };
      const response = await call({
        method: 'PATCH',
        body: referral,
        params: { id }
      });
      expect(updateReferralStatus.execute).toHaveBeenCalledWith({ referral });
      expect(response.statusCode).toBe(204);
      expect(response.body).toBeUndefined();
    });

    it('accepts PATCH requests', async () => {
      const response = await call({ method: 'PATCH' });
      expect(response.statusCode).not.toBe(405);
    });

    it('does not accept other requests', async () => {
      const response = await call({ method: 'POST' });
      expect(response.statusCode).toBe(405);
    });

    it('returns a 500 for other errors', async () => {
      updateReferralStatus.execute = jest.fn(() => {
        throw new Error();
      });
      const response = await call({
        method: 'PATCH',
        params: { id }
      });
      expect(response.statusCode).toBe(500);
    });
  });
});
