export default class SendReferralReceiptEmail {
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
      serviceName: referral.serviceName,
      serviceReferralEmail: referral.serviceReferralEmail,
      serviceContactPhone: referral.serviceContactPhone,
      serviceContactEmail: referral.serviceContactEmail,
      referenceNumber: referral.referenceNumber
    };
    return await this.notifyGateway.sendEmail(
      process.env.REFERRAL_RECEIPT_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
