import SendReferralResponseEmail from 'lib/use-cases/send-referral-response-email';
import { REFERRAL_STATUSES } from 'lib/utils/constants';

describe('Send email use case', () => {
  const getReferral = statusHistory => {
    return {
      name: 'jon',
      serviceName: 'service',
      referrerName: 'referrer',
      statusHistory
    };
  };
  it('sends a referral accepted response email', async () => {
    const emailAddress = 'email@email.com';
    const statusHistory = [
      {
        status: REFERRAL_STATUSES.Rejected,
        date: '2021-07-02T12:19:15.179Z',
        comments: 'A very small zebra.'
      },
      {
        status: REFERRAL_STATUSES.Accepted,
        date: '2021-07-03T12:19:15.179Z'
      }
    ];

    const referral = getReferral(statusHistory);

    const personalisation = {
      name: 'jon',
      referrerName: 'referrer',
      serviceName: 'service'
    };

    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };

    process.env.REFERRAL_ACCEPTED_EMAIL_TEMPLATE_ID = 'accepted';
    const sendReferralEmail = new SendReferralResponseEmail({ notifyGateway });
    const result = await sendReferralEmail.execute({ emailAddress, referral });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'accepted',
      emailAddress,
      expect.objectContaining(personalisation)
    );
    expect(result).toEqual('email sent');
  });

  it('sends a referral rejected response email', async () => {
    const emailAddress = 'email@email.com';
    const statusHistory = [
      {
        status: REFERRAL_STATUSES.Rejected,
        date: '2021-07-02T12:19:15.179Z',
        comments: 'A very small zebra.'
      },
      {
        status: REFERRAL_STATUSES.Rejected,
        date: '2021-07-03T12:19:15.179Z'
      }
    ];

    const referral = getReferral(statusHistory);

    const personalisation = {
      name: 'jon',
      referrerName: 'referrer',
      serviceName: 'service'
    };

    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };

    process.env.REFERRAL_REJECTED_EMAIL_TEMPLATE_ID = 'rejected';
    const sendReferralEmail = new SendReferralResponseEmail({ notifyGateway });
    const result = await sendReferralEmail.execute({ emailAddress, referral });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'rejected',
      emailAddress,
      expect.objectContaining(personalisation)
    );
    expect(result).toEqual('email sent');
  });

  it('sends a referral rejected with commments response email', async () => {
    const emailAddress = 'email@email.com';
    const statusHistory = [
      {
        status: REFERRAL_STATUSES.Rejected,
        date: '2021-07-02T12:19:15.179Z',
        comments: 'A very small zebra.'
      },
      {
        status: REFERRAL_STATUSES.Rejected,
        date: '2021-07-03T12:19:15.179Z',
        comment: 'comment'
      }
    ];

    const referral = getReferral(statusHistory);

    const personalisation = {
      name: 'jon',
      referrerName: 'referrer',
      serviceName: 'service',
      comments: 'comment'
    };

    const notifyGateway = {
      sendEmail: jest.fn(() => 'email sent')
    };

    process.env.REFERRAL_REJECTED_WITH_COMMENTS_EMAIL_TEMPLATE_ID = 'rejected with comment';
    const sendReferralEmail = new SendReferralResponseEmail({ notifyGateway });
    const result = await sendReferralEmail.execute({ emailAddress, referral });

    expect(notifyGateway.sendEmail).toHaveBeenCalledWith(
      'rejected with comment',
      emailAddress,
      expect.objectContaining(personalisation)
    );
    expect(result).toEqual('email sent');
  });
});
