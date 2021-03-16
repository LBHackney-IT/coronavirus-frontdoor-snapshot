import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Get/Update Referral Api', () => {
  const id = '1';
  const getReferral = { execute: jest.fn(() => ({ id })) };
  const updateReferral = { execute: jest.fn(() => ({ id })) };
  const call = async ({ body, method, params }) => {
    const response = createMockResponse();
    await endpoint({ getReferral, updateReferral })(
      {
        body,
        query: params,
        method
      },
      response
    );
    return response;
  };

  describe('Get', () => {
    it('can get a referral', async () => {
      const response = await call({ method: 'GET', params: { id } });
      expect(getReferral.execute).toHaveBeenCalledWith({ id });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(JSON.stringify({ id }));
    });

    it('accepts GET requests', async () => {
      const response = await call({ method: 'GET' });
      expect(response.statusCode).not.toBe(405);
    });

    it('does not accept other requests', async () => {
      const response = await call({ method: 'POST' });
      expect(response.statusCode).toBe(405);
    });

    it('returns a 500 for other errors', async () => {
      getReferral.execute = jest.fn(() => {
        throw new Error();
      });
      const response = await call({
        method: 'GET',
        params: { id }
      });
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Update', () => {
    it('can update a referral', async () => {
      const referral = { id: 1 };
      const response = await call({
        method: 'PATCH',
        body: referral,
        params: { id }
      });
      expect(updateReferral.execute).toHaveBeenCalledWith({ referral });
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
      updateReferral.execute = jest.fn(() => {
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
