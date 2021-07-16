import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { createConversation } from 'lib/dependencies';
import { Conversation } from '../../../lib/domain';

export const endpoint = ({ createConversation }) =>
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
        },
        {
          name: 'email',
          failureMessage: 'resident email is required',
          validate: ({ body }) => body.email && body.email.length > 0
        },
        {
          name: 'discussedServices',
          failureMessage: 'discussed services are required',
          validate: ({ body }) => body.discussedServices && body.discussedServices.length > 0
        },
        {
          name: 'signPostingMessage',
          failureMessage: 'sign posting message is required',
          validate: ({ body }) => body.signPostingMessage && body.signPostingMessage.length > 0
        }
      ]
    },
    async ({
      body: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        userOrganisation,
        userName,
        userEmail,
        dateOfBirth,
        sharingMethod,
        discussedServices,
        signPostingMessage
      },
      headers
    }) => {
      const convo = new Conversation({
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        userOrganisation,
        userName,
        userEmail,
        dateOfBirth,
        discussedServices,
        signPostingMessage
      });
      const referral = await createConversation.execute(convo, sharingMethod);
      return Response.created(referral);
    }
  );

export default endpoint({ createConversation });
