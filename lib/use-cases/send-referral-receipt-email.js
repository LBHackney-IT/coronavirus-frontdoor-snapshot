export default class SendReferralReceiptEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ referral }) {
    const personalisation = {
      name: referral.name,
      phone: referral.phone,
      email: referral.email,
      referralReason: referral.referralReason,
      conversationNotes: referral.conversationNotes,
      referrerName: referral.referrerName
    };
    return await this.notifyGateway.sendEmail(
      process.env.REFERRAL_RECEIPT_EMAIL_TEMPLATE_ID,
      referral.referrerEmail,
      personalisation
    );
  }
}
