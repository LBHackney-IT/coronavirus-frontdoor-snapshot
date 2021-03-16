import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { findReferrals } from 'lib/dependencies';

export const endpoint = ({ findReferrals }) =>
  createEndpoint(
    {
      allowedMethods: ['POST'],
      validators: [
        {
          name: 'firstName',
          failureMessage: 'first name is required',
          validate: ({ body }) => body.firstName?.length > 0
        },
        {
          name: 'lastName',
          failureMessage: 'last name is required',
          validate: ({ body }) => body.lastName?.length > 0
        }
      ]
    },
    async ({ body: { firstName, lastName, systemIds } }) => {
      const result = await findReferrals.execute({
        firstName,
        lastName,
        systemIds
      });
      return Response.ok(result);
    }
  );

export default endpoint({ findReferrals });
