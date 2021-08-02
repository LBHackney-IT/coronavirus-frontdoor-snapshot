import SendSignpostReceiptEmail from 'lib/use-cases/send-signpost-receipt-email';

describe('Send email use case', () => {
  it('sends a signpost receipt email', async () => {
    const emailAddress = 'email@email.com';
    const conversation = {
      name: 'jon',
      phone: '0712345678',
      email: 'jon@mail.com',
      signPostingMessage: 'message'
    };
    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };
    process.env.CONVERSATION_RECEIPT_EMAIL_TEMPLATE_ID = 'xx';
    const sendSignpostReceiptEmail = new SendSignpostReceiptEmail({
      notifyGateway
    });
    const result = await sendSignpostReceiptEmail.execute({
      emailAddress,
      conversation
    });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith('xx', emailAddress, {
      name: conversation.name,
      phone: conversation.phone,
      email: conversation.email,
      summaryEmail: conversation.signPostingMessage
    });
    expect(result).toEqual('email sent');
  });
});
