export default class SendReferralResidentEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ emailAddress, referral }) {
    const personalisation = {
      name: referral.name,
      email: referral.email,
      referrerName: referral.referrerName,
      referrerOrganisation: referral.referrerOrganisation,
      serviceName: referral.serviceName,
      serviceWebsite: referral.serviceWebsite,
      serviceAddress: referral.serviceAddress,
      serviceContactPhone: referral.serviceContactPhone,
      serviceContactEmail: referral.serviceContactEmail
    };
    return await this.notifyGateway.sendEmail(
      process.env.REFERRAL_RESIDENT_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
