import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { findReferrals } from 'lib/dependencies';

export const endpoint = ({ findReferrals }) =>
  createEndpoint(
    {
      allowedMethods: ['POST']
    },
    async ({ body: { firstName, lastName, systemIds, referrerEmail } }) => {
      const result = await findReferrals.execute({
        firstName,
        lastName,
        systemIds,
        referrerEmail
      });
      return Response.ok(result);
    }
  );

export default endpoint({ findReferrals });
