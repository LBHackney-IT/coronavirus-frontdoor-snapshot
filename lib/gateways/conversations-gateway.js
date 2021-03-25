import { nanoid } from 'nanoid';
import { ArgumentError, Referral, Conversation } from 'lib/domain';
import { createDomainModel, createReferralFromModel } from './models';

import moment from 'moment';

class ConversationsGateway {
  constructor({ client, tableName }) {
    this.client = client;
    this.tableName = tableName;
  }

  async create({ resident, discussedServices, signPostingMessage, user, systemIds, emails }) {
    const conversation = new Conversation({
      id: nanoid(8),
      resident,
      discussedServices,
      signPostingMessage,
      user,
      systemIds,
      emails
    });

    const request = {
      TableName: this.tableName,
      Item: createDomainModel(conversation, Conversation)
    };

    await this.client.put(request).promise();
    return conversation;
  }
}

export default ConversationsGateway;
