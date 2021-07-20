import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { getReferralByLinkId } from 'lib/dependencies';

export const endpoint = ({ getReferralByLinkId }) =>
  createEndpoint(
    {
      allowedMethods: ['GET']
    },
    async ({ method, params: { linkId } }) => {
      const result = await getReferralByLinkId.execute({ linkId });
      return Response.ok(result);
    }
  );

export default endpoint({ getReferralByLinkId });
