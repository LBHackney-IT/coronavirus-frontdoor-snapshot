import { convertObjectToIsoDate } from 'lib/utils/date';
import { EMAIL, LETTER } from 'lib/utils/constants';

export default class CreateConversation {
  constructor({
    conversationsGateway,
    sendSignpostEmail,
    sendSignpostLetter,
    sendSignpostReceiptEmail
  }) {
    this.conversationsGateway = conversationsGateway;
    this.sendSignpostEmail = sendSignpostEmail;
    this.sendSignpostLetter = sendSignpostLetter;
    this.sendSignpostReceiptEmail = sendSignpostReceiptEmail;
  }

  async execute(
    { resident, user, discussedServices, signPostingMessage, systemIds = [] },
    sharingMethod
  ) {
    resident.dateOfBirth = convertObjectToIsoDate(resident.dateOfBirth);

    const errors = [];

    let signPostingEmail;
    if (sharingMethod == EMAIL) {
      signPostingEmail = await this.sendSignpostEmail.execute({
        emailAddress: resident.email,
        signPostingMessage
      });
      if (signPostingEmail.response.status > 201) {
        errors.push('Failed to send sign posting email to resident');
      }
    }
    let signPostingLetter;
    if (sharingMethod == LETTER) {
      signPostingLetter = await this.sendSignpostLetter.execute({
        name: `${resident.firstName} ${resident.lastName}`,
        address: resident.address,
        postcode: resident.postcode,
        signPostingMessage
      });
      if (signPostingLetter.response.status > 201) {
        errors.push('Failed to send sign posting letter to resident');
      }
    }

    const signPostingReceiptEmail = await this.sendSignpostReceiptEmail.execute({
      emailAddress: user.email,
      conversation: {
        userName: `${user.name}`,
        name: `${resident.firstName} ${resident.lastName}`,
        phone: `${resident.phone}`,
        email: `${resident.email}`,
        signPostingMessage: `${signPostingMessage}`
      }
    });

    if (signPostingReceiptEmail.response.status > 201) {
      errors.push('Failed to send sign posting receipt email to the user');
    }

    const conversation = await this.conversationsGateway.create({
      resident,
      user,
      discussedServices,
      signPostingMessage,
      systemIds,
      emails: {
        conversationEmailId: signPostingEmail?.response?.data?.id,
        conversationReceiptEmailId: signPostingReceiptEmail.response?.data?.id
      },
      letters: {
        conversationLetterId: signPostingLetter?.response?.data?.id
      }
    });

    return {
      id: conversation.id,
      errors: errors
    };
  }
}
