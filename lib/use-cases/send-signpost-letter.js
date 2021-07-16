export default class SendSignpostLetter {
  constructor({ notifyGateway }) {
    this.notifyGateway = notifyGateway;
  }

  async execute({ name, address, postcode, signPostingMessage }) {
    const personalisation = {
      address_line_1: name,
      address_line_2: address,
      address_line_3: postcode,
      body: signPostingMessage
    };
    return await this.notifyGateway.sendLetter(
      process.env.SIGNPOST_LETTER_TEMPLATE_ID,
      personalisation
    );
  }
}
