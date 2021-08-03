export default class SendSignpostReceiptEmail {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ emailAddress, conversation }) {
    const personalisation = {
      userName: conversation.userName,
      name: conversation.name,
      phone: conversation.phone,
      email: conversation.email,
      summaryEmail: conversation.signPostingMessage
    };
    return await this.notifyGateway.sendEmail(
      process.env.SIGNPOST_RECEIPT_EMAIL_TEMPLATE_ID,
      emailAddress,
      personalisation
    );
  }
}
