export default class UpdateReferralStatus {
  constructor({ updateReferral, sendReferralResponseEmail }) {
    this.updateReferral = updateReferral;
    this.sendReferralResponseEmail = sendReferralResponseEmail;
  }

  async execute({ referral }) {
    await this.updateReferral.execute({
      referral: { id: referral.id, statusHistory: referral.statusHistory }
    });
    await this.sendReferralResponseEmail.execute({
      emailAddress: referral.referrer.email,
      referral: {
        name: `${referral.resident.firstName} ${referral.resident.lastName}`,
        referrerName: referral.referrer.name,
        serviceName: referral.service.name,
        referenceNumber: referral.referenceNumber,
        statusHistory: referral.statusHistory
      }
    });
  }
}
