const { NotifyClient } = require('notifications-node-client');

class NotifyGateway {
  constructor({ apiKey }) {
    this.notify = new NotifyClient(apiKey);
    console.log('0 0 0 0 0 0 0 0 0 0');
    console.log(this.notify);
  }

  async sendEmail({templateId, emailAddress, personalisation}) {
    this.notify
      .sendEmail(templateId, emailAddress, {
        personalisation: personalisation,
        reference: null, // This reference identifies a single unique notification or a batch of notifications (could be systemId, setting null as it's required)
      })
      .then(response => {return response})
      .catch(err => {return err});
  }
}

export default NotifyGateway;
