export default class SendReferralEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ emailAddress, referral }) {
    const personalisation = {
      name: referral.name,
      phone: referral.phone,
      email: referral.email,
      referralReason: referral.referralReason,
      conversationNotes: referral.conversationNotes,
      referrerName: referral.referrerName,
      referrerOrganisation: referral.referrerOrganisation,
      referrerEmail: referral.referrerEmail
    };
    return await this.notifyGateway.sendEmail(
      process.env.REFERRAL_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
