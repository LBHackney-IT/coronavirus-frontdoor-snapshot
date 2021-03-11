export default class SendEmail {
    constructor({ notifyGateway }) {
        this.notifyGateway = notifyGateway;
    }

    async execute(templateId, emailAddress, personalisation) {
        console.log(this.notifyGateway);

        return await this.notifyGateway.sendEmail(templateId, emailAddress, personalisation);
    }
}