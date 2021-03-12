import SendReferralEmail from 'lib/use-cases/send-referral-email';

describe('Send email use case', () => {
  it('sends a referral email', async () => {
    const emailAddress = 'email@email.com';
    const referral = { name: 'jon' };
    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };
    process.env.REFERRAL_EMAIL_TEMPLATE_ID = 'xx';
    const sendReferralEmail = new SendReferralEmail({ notifyGateway });
    const result = await sendReferralEmail.execute({ emailAddress, referral });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'xx',
      emailAddress,
      expect.objectContaining(referral)
    );
    expect(result).toEqual('email sent');
  });
});
