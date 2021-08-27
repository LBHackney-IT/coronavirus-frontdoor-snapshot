import { endpoint } from './[templateName]';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('get template preview', () => {
  let getTemplatePreview = {
    execute: jest.fn(() => {
      return { id: 1 };
    })
  };
  const call = async ({ body, method, params }) => {
    const response = createMockResponse();
    await endpoint({ getTemplatePreview })(
      {
        body,
        query: params,
        method
      },
      response
    );
    return response;
  };

  describe('Post', () => {
    it('can get the template preview', async () => {
      const response = await call({
        method: 'POST',
        body: { id: 1 },
        params: { templateName: 'name' }
      });

      expect(getTemplatePreview.execute).toHaveBeenCalledWith({ templateName: 'name', id: 1 });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({ id: 1 });
    });
  });
});
