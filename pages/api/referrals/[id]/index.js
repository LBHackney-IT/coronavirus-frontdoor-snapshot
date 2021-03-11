import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { getReferral, updateReferral } from 'lib/dependencies';

export const endpoint = ({ getReferral, updateReferral }) =>
  createEndpoint(
    {
      allowedMethods: ['GET', 'PATCH']
    },
    async ({ method, params: { id }, body: referral }) => {
      if (method === 'PATCH') {
        await updateReferral.execute({ referral });
        return Response.noContent();
      }

      const result = await getReferral.execute({ id });
      return Response.ok(result);
    }
  );

export default endpoint({ getReferral, updateReferral });
