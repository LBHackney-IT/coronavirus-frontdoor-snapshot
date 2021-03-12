import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Create SendEmail Api endpoint', () => {
    const sendEmail = { execute: jest.fn() };
    const call = async ({ body, headers, method }) => {
        const response = createMockResponse();

        await endpoint({ sendEmail })(
            {
                body,
                headers,
                method: method || 'POST'
            },
            response
        );
        return response;
    };

    it('can send an email referral', async () => {
        const templateId = '1';
        const personalisation = 'email body';
        const emailAddress = 'email@email.com'
        const response = await call({
            body: { templateId, personalisation, emailAddress },
            headers: {}
        });
        expect(sendEmail.execute).toHaveBeenCalledWith({
            templateId,
            personalisation,
            emailAddress
        });
        expect(response.statusCode).toBe(200);
    });

    it('does not accept non-POST requests', async () => {
        const response = await call({ method: 'GET' });
        expect(response.statusCode).toBe(405);
    });

    describe('validation', () => {
        it('returns 400 when no templateId is provided', async () => {
            const response = await call({
                body: {
                    personalisation: 'email body',
                    emailAddress: 'email@email.com'
                }
            });
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).errors.length).toBe(1);
        });

        it('returns 400 when no personalisation', async () => {
            const response = await call({
                body: {
                    templateId: '1',
                    emailAddress: 'email@email.com'
                }
            });
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).errors.length).toBe(1);
        });

        it('returns 400 when no email address', async () => {
            const response = await call({
                body: {
                    personalisation: 'email body',
                    templateId: '1'
                }
            });
            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body).errors.length).toBe(1);
        });
    });

    it('returns a 500 for other errors', async () => {
        sendEmail.execute = jest.fn(() => {
            throw new Error();
        });
        const response = await call({
            body: {
                templateId: '1',
                personalisation: 'email body',
                emailAddress: 'email@email.com',
            }
        });
        expect(response.statusCode).toBe(500);
    });
});
