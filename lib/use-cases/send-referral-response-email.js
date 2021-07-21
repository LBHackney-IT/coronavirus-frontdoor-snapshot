import { REFERRAL_STATUSES } from 'lib/utils/constants';

export default class SendReferralResponseEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ emailAddress, referral }) {
    const maxDate = new Date(Math.max(...referral.statusHistory.map(e => new Date(e.date))));
    const recentStatus = referral.statusHistory.filter(
      status => new Date(status.date).getTime() == maxDate.getTime()
    )[0];

    const personalisation = {
      name: referral.name,
      referrerName: referral.referrerName,
      serviceName: referral.serviceName,
      hasComments: recentStatus.comments ? true : false,
      comments: recentStatus.comments,
      isAccepted: recentStatus.status == REFERRAL_STATUSES.Accepted,
      isRejected: recentStatus.status == REFERRAL_STATUSES.Rejected,
      referenceCode: referral.referenceNumber
    };

    return await this.notifyGateway.sendEmail(
      process.env.REFERRAL_RESPONSE_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
