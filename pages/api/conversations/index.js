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
          name: 'services',
          failureMessage: 'services are required',
          validate: ({ body }) => body.services && body.services.length > 0
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
        services,
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
        services,
        signPostingMessage
      });
      const referral = await createConversation.execute(convo);
      return Response.created(referral);
    }
  );

export default endpoint({ createConversation });

// services = [
//   {
//     id: 2,
//     name: 'Garlic Bread Support',
//     contactEmail: 'contact@gbs.com',
//     referralEmail: 'referral@gbs.com',
//     website: 'www.gbs.com',
//     address: '123 Some st, E3 1J',
//     referral: 'ABC121'
//   },
//   {
//     id: 2,
//     name: 'Chocolate Deliveries',
//     contactEmail: 'contact@chocolatedeliveries.com',
//     referralEmail: 'referral@chocolatedeliveries.com',
//     website: 'www.chocolatedeliveries.com',
//     address: '123 Other st, E3 1P'
//   }
// ]
