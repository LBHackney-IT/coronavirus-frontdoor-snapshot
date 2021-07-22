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

    let personalisation = {
      name: referral.name,
      referrerName: referral.referrerName,
      serviceName: referral.serviceName,
      referenceCode: referral.referenceNumber || '',
      comments: recentStatus.comment
    };

    let templateId = process.env.REFERRAL_REJECTED_EMAIL_TEMPLATE_ID;
    if (recentStatus.status == REFERRAL_STATUSES.Accepted) {
      templateId = process.env.REFERRAL_ACCEPTED_EMAIL_TEMPLATE_ID;
    } else {
      if (recentStatus.comment) {
        templateId = process.env.REFERRAL_REJECTED_WITH_COMMENTS_EMAIL_TEMPLATE_ID;
      }
    }
    return await this.notifyGateway.sendEmail(templateId, emailAddress, personalisation);
  }
}
