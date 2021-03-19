import SendReferralReceiptEmail from 'lib/use-cases/send-referral-receipt-email';

describe('Send email use case', () => {
  it('sends a referral email', async () => {
    const emailAddress = 'email@email.com';
    const referral = {
      name: 'jon',
      phone: '0712345678',
      email: 'jon@mail.com',
      referralReason: 'need something',
      conversationNotes: 'talked about needing something',
      serviceName: 'Help with things',
      serviceReferralEmail: 'referral@help.com',
      serviceContactPhone: '02045678987',
      serviceContactEmail: 'contact@help.com'
    };
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

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith('xx', emailAddress, {
      name: referral.name,
      phone: referral.phone,
      email: referral.email,
      referralReason: referral.referralReason,
      conversationNotes: referral.conversationNotes,
      serviceName: referral.serviceName,
      serviceReferralEmail: referral.serviceReferralEmail,
      serviceContactPhone: referral.serviceContactPhone,
      serviceContactEmail: referral.serviceContactEmail
    });
    expect(result).toEqual('email sent');
  });
});
