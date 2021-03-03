import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { findFssResources } from 'lib/dependencies';

export const endpoint = ({ findFssResources }) =>
  createEndpoint({ allowedMethods: ['GET'] }, async () => {
    const fssResources = await findFssResources.execute();
    return Response.ok(fssResources);
  });

export default endpoint({ findFssResources });
