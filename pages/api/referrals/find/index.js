import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { findReferrals } from 'lib/dependencies';

export const endpoint = ({ findReferrals }) =>
  createEndpoint(
    {
      allowedMethods: ['POST'],
      validators: [
        {
          name: 'findBy',
          failureMessage: 'findBy is required',
          validate: ({ body }) => body.findBy && ['referrerEmail'].includes(body.findBy)
        }
      ]
    },
    async ({ body: { findBy }, headers }) => {
      const result = await findReferrals.execute({ findBy }, headers.cookie);
      return Response.ok(result);
    }
  );

export default endpoint({ findReferrals });
