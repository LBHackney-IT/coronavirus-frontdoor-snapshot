import SendSignpostLetter from 'lib/use-cases/send-signpost-letter';

describe('Send letter use case', () => {
  it('sends a signpost letter', async () => {
    const name = 'name surname';
    const address = 'address';
    const postcode = 'P0 5T';
    const signPostingMessage =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const notifyGateway = {
      sendLetter: jest.fn(() => 'letter sent')
    };

    process.env.SIGNPOST_LETTER_TEMPLATE_ID = '1234567';
    const sendSignpostLetter = new SendSignpostLetter({
      notifyGateway
    });

    const result = await sendSignpostLetter.execute({
      name,
      address,
      postcode,
      signPostingMessage
    });

    expect(notifyGateway.sendLetter).toHaveBeenCalledWith('1234567', {
      address_line_1: name,
      address_line_2: address,
      address_line_3: postcode,
      body: signPostingMessage
    });
    expect(result).toEqual('letter sent');
  });
});
