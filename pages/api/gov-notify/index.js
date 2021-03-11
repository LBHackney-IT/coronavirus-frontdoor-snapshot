import createEndpoint from 'lib/api/utils/createEndpoint';
import Response from 'lib/api/domain/Response';
import { sendEmail } from 'lib/dependencies';

export const endpoint = ({ sendEmail }) =>
    createEndpoint(
        {
            allowedMethods: ['POST'],
            validators: [
                {
                    name: 'templateId',
                    failureMessage: 'template id is required',
                    validate: ({ body }) => body.templateId?.length > 0
                },
                {
                    name: 'personalisation',
                    failureMessage: 'personalisation is required',
                    validate: ({ body }) => body.personalisation?.length > 0
                },
                {
                    name: 'emailAddress',
                    failureMessage: 'email address is required',
                    validate: ({ body }) => body.emailAddress?.length > 0
                }
            ]
        },
        async ({ body: { templateId, personalisation, emailAddress }, headers }) => {
            const email = await sendEmail.execute({
                templateId, 
                emailAddress, 
                personalisation
            });
            return Response.ok(email);
        }
    );

export default endpoint({ sendEmail });
