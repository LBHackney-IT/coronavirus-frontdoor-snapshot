import { convertObjectToIsoDate } from 'lib/utils/date';

export default class CreateConversation {
  constructor({ conversationsGateway, sendSignpostEmail }) {
    this.conversationsGateway = conversationsGateway;
    this.sendSignpostEmail = sendSignpostEmail;
  }

  async execute({ resident, user, discussedServices, signPostingMessage, systemIds = [] }) {
    resident.dateOfBirth = convertObjectToIsoDate(resident.dateOfBirth);

    const errors = [];

    const signPostingEmail = await this.sendSignpostEmail.execute({
      emailAddress: resident.email,
      signPostingMessage
    });

    if (signPostingEmail.response.status > 201) {
      errors.push('Failed to send sign posting email to resident');
    }

    const conversation = await this.conversationsGateway.create({
      resident,
      user,
      discussedServices,
      signPostingMessage,
      systemIds,
      emails: {
        conversationEmailId: signPostingEmail.response.data?.id
      }
    });

    return {
      id: conversation.id,
      errors: errors
    };
  }
}
