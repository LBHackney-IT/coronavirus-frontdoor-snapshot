import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { createReferral } from 'lib/dependencies';
import { getUsername, getTokenFromAuthHeader } from 'lib/utils/token';

export const endpoint = ({ createReferral }) =>
  createEndpoint(
    {
      allowedMethods: ['POST'],
      validators: [
        {
          name: 'firstName',
          failureMessage: 'first name is required',
          validate: ({ body }) => body.firstName && body.firstName.length > 0
        },
        {
          name: 'lastName',
          failureMessage: 'last name is required',
          validate: ({ body }) => body.lastName && body.lastName.length > 0
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
        conversationNotes,
        referrerName,
        referrerOrganisation,
        referrerEmail,
        dateOfBirth
      },
      headers
    }) => {
      const createdBy = getUsername(getTokenFromAuthHeader(headers));
      const referral = await createReferral.execute({
        createdBy,
        dob,
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        referralReason,
        conversationNotes,
        referrerName,
        referrerOrganisation,
        referrerEmail,
        dateOfBirth
      });
      return Response.created(referral);
    }
  );

export default endpoint({ createReferral });
