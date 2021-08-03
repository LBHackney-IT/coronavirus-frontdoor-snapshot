import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { findReferrals } from 'lib/dependencies';

export const endpoint = ({ findReferrals }) =>
  createEndpoint(
    {
      allowedMethods: ['POST'],
      validators: [
        {
          name: 'referrerEmail',
          failureMessage: 'referrerEmailis required',
          validate: ({ body }) => body.referrerEmail && body.referrerEmail.length > 0
        }
      ]
    },
    async ({ body: { referrerEmail } }) => {
      const result = await findReferrals.execute({
        referrerEmail
      });
      return Response.ok(result);
    }
  );

export default endpoint({ findReferrals });
