import SendEmail from 'lib/use-cases/send-email';

describe('Send email use case', () => {
    it('sends a referral email', async () => {
        const templateId = 1;
        const emailAddress = 'email@email.com';
        const personalisation = 'Test email';
        const notifyGateway = {
            sendEmail: jest.fn(() => "email sent")
        };

        const sendReferralEmail = new SendEmail({ notifyGateway });

        const result = await sendReferralEmail.execute(templateId, emailAddress, personalisation);

        expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
            templateId, emailAddress, personalisation
        );
        expect(result).toEqual("email sent");
    });
});