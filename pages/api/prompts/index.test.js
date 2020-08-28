import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Get Prompts API', () => {
  const prompts = [];

  const getPrompts = {
    execute: jest.fn(() => Promise.resolve(prompts))
  };

  const call = async ({ body, headers, method }) => {
    const response = createMockResponse();

    await endpoint({ getPrompts })(
      {
        body,
        headers,
        method
      },
      response
    );

    return response;
  };

  it('returns a 200 with list of prompts', async () => {
    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(prompts));
  });

  it('does not accept non-GET requests', async () => {
    const response = await call({ method: 'POST' });
    expect(response.statusCode).toBe(405);
  });

  it('returns a 500 for other errors', async () => {
    getPrompts.execute = jest.fn(() => {
      throw new Error();
    });

    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(500);
  });
});
