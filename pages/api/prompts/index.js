import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { getPrompts } from 'lib/dependencies';

export const endpoint = ({ getPrompts }) =>
  createEndpoint({ allowedMethods: ['GET'] }, async () => {
    const prompts = await getPrompts.execute();
    return Response.ok(prompts);
  });

export default endpoint({ getPrompts });
