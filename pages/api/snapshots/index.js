import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { createSnapshot } from 'lib/dependencies';
import { getUsername, getTokenFromAuthHeader } from 'lib/utils/token';

export const endpoint = ({ createSnapshot }) =>
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
    async ({
      body: {
        dob,
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        referralReason,
        conversationNotes
      },
      headers
    }) => {
      const createdBy = getUsername(getTokenFromAuthHeader(headers));
      const snapshot = await createSnapshot.execute({
        createdBy,
        dob,
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        referralReason,
        conversationNotes
      });
      return Response.created(snapshot);
    }
  );

export default endpoint({ createSnapshot });
