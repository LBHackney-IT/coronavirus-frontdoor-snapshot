export default class SendEmail {
    constructor({ notifyGateway }) {
        this.notifyGateway = notifyGateway;
    }

    async execute({templateId, emailAddress, personalisation}) {

        return await this.notifyGateway.sendEmail(templateId, emailAddress, personalisation);
    }
}