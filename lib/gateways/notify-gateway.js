import { ArgumentError } from '../domain';

const { NotifyClient } = require('notifications-node-client');

class NotifyGateway {
  constructor({ apiKey }) {
    this.notify = new NotifyClient(apiKey);
  }

  isRequired(argumentName) {
    throw new ArgumentError(`${argumentName} is required`);
  }

  async sendEmail(templateId = this.isRequired('templateId'), emailAddress, personalisation) {
    return this.notify
      .sendEmail(templateId, emailAddress, {
        personalisation: personalisation,
        reference: null // This reference identifies a single unique notification or a batch of notifications (could be systemId, setting null as it's required)
      })
      .then(response => {
        return { response };
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }

  async sendSms(templateId = this.isRequired('templateId'), phoneNumber, personalisation) {
    return this.notify
      .sendSms(templateId, phoneNumber, {
        personalisation: personalisation,
        reference: null
      })
      .then(response => {
        return { response };
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}

export default NotifyGateway;
