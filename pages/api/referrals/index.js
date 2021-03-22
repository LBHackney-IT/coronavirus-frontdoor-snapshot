import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { createReferral } from 'lib/dependencies';
import { Referral } from '../../../lib/domain';

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
        },
        {
          name: 'serviceReferralEmail',
          failureMessage: 'service referral email is required',
          validate: ({ body }) => body.serviceReferralEmail && body.serviceReferralEmail.length > 0
        },
        {
          name: 'email',
          failureMessage: 'resident email is required',
          validate: ({ body }) => body.serviceReferralEmail && body.serviceReferralEmail.length > 0
        },
        {
          name: 'serviceId',
          failureMessage: 'service id is required',
          validate: ({ body }) => body.serviceReferralEmail && body.serviceReferralEmail.length > 0
        },
        {
          name: 'referrerEmail',
          failureMessage: 'referrer email is required',
          validate: ({ body }) => body.serviceReferralEmail && body.serviceReferralEmail.length > 0
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
        referralReason,
        conversationNotes,
        referrerOrganisation,
        referrerName,
        referrerEmail,
        dateOfBirth,
        serviceId,
        serviceName,
        serviceContactEmail,
        serviceContactPhone,
        serviceReferralEmail,
        serviceAddress,
        serviceWebsites,
        sendResidentSms,
        sendResidentEmail
      },
      headers
    }) => {
      const referral = await createReferral.execute(
        new Referral({
          firstName,
          lastName,
          phone,
          email,
          address,
          postcode,
          referralReason,
          conversationNotes,
          referrerOrganisation,
          referrerName,
          referrerEmail,
          dateOfBirth,
          serviceId,
          serviceName,
          serviceContactEmail,
          serviceContactPhone,
          serviceReferralEmail,
          serviceAddress,
          serviceWebsites
        }),
        sendResidentSms,
        sendResidentEmail
      );
      return Response.created(referral);
    }
  );

export default endpoint({ createReferral });
