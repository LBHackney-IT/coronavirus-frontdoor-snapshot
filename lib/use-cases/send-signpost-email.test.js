import SendSignpostEmail from 'lib/use-cases/send-signpost-email';

describe('Send email use case', () => {
  it('sends a signpost email', async () => {
    const emailAddress = 'email@email.com';
    const signPostingMessage =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };

    process.env.SIGNPOSTL_EMAIL_TEMPLATE_ID = '0010102';
    const sendReferralResidentEmail = new SendSignpostEmail({
      notifyGateway
    });

    const result = await sendReferralResidentEmail.execute({
      emailAddress,
      signPostingMessage
    });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith('0010102', emailAddress, {
      body: signPostingMessage
    });
    expect(result).toEqual('email sent');
  });
});
