export default class SendSignpostEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ emailAddress, signPostingMessage }) {
    const personalisation = {
      body: signPostingMessage
    };
    return await this.notifyGateway.sendEmail(
      process.env.SIGNPOSTL_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
