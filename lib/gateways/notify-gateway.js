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
    if (templateId == '') return null;
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
    if (templateId == '') return null;
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

  async sendLetter(templateId = this.isRequired('templateId'), personalisation) {
    if (templateId == '') return null;
    return this.notify
      .sendLetter(templateId, {
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

  async getTemplatePreview(
    previewTemplateId = this.isRequired('previewTemplateId'),
    personalisation = {}
  ) {
    if (previewTemplateId == '') return null;
    try {
      const response = await this.notify.previewTemplateById(previewTemplateId, personalisation);
      return response;
    } catch (error) {
      console.log(`Get template error: ${error}`);
      return null;
    }
  }
}

export default NotifyGateway;
