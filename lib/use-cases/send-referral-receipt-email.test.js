import SendReferralReceiptEmail from 'lib/use-cases/send-referral-receipt-email';

describe('Send email use case', () => {
  it('sends a referral email', async () => {
    const emailAddress = 'email@email.com';
    const referral = { name: 'jon', referrerEmail: 'mail' };
    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };
    process.env.REFERRAL_RECEIPT_EMAIL_TEMPLATE_ID = 'xx';
    const sendReferralReceiptEmail = new SendReferralReceiptEmail({
      notifyGateway
    });
    const result = await sendReferralReceiptEmail.execute({
      emailAddress,
      referral
    });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'xx',
      referral.referrerEmail,
      expect.objectContaining({ name: 'jon' })
    );
    expect(result).toEqual('email sent');
  });
});
