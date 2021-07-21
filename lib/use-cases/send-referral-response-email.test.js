import SendReferralResponseEmail from 'lib/use-cases/send-referral-response-email';
import { REFERRAL_STATUSES } from 'lib/utils/constants';

describe('Send email use case', () => {
  it('sends a referral response email', async () => {
    const emailAddress = 'email@email.com';
    const referral = {
      name: 'jon',
      statusHistory: [
        {
          status: REFERRAL_STATUSES.Rejected,
          date: '2021-07-02T12:19:15.179Z',
          comments: 'A very small zebra.'
        },
        {
          status: REFERRAL_STATUSES.Approved,
          date: '2021-07-03T12:19:15.179Z',
          comments: 'A very large zebra.'
        }
      ]
    };

    const personalisation = {
      name: 'jon',
      isAccepted: true,
      isRejected: false,
      hasComments: true,
      comments: 'A very large zebra.'
    };

    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };

    process.env.REFERRAL_RESPONSE_EMAIL_TEMPLATE_ID = 'xx';
    const sendReferralEmail = new SendReferralResponseEmail({ notifyGateway });
    const result = await sendReferralEmail.execute({ emailAddress, referral });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'xx',
      emailAddress,
      expect.objectContaining(personalisation)
    );
    expect(result).toEqual('email sent');
  });
});
