import { logger } from '../infrastructure/logging';
import { ArgumentError } from '../domain';

const { NotifyClient } = require('notifications-node-client');

class NotifyGateway {
  constructor({apiKey}) {
    this.notify = new NotifyClient(apiKey);
    console.log('0 0 0 0 0 0 0 0 0 0');
    console.log(this.notify);
  }

  isRequired(argumentName) {
    throw new ArgumentError(`${argumentName} is required`);
  }

  async sendEmail(
    templateId = this.isRequired('templateId'),
    emailAddress,
    personalisation
  ) {
    return this.notify
      .sendEmail(templateId, emailAddress, {
        personalisation: personalisation,
        reference: null // This reference identifies a single unique notification or a batch of notifications (could be systemId, setting null as it's required)
      })
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}

export default NotifyGateway;