import { TEMPLATE_NAMES } from 'lib/utils/constants';

export default class GetTemplatePreview {
  constructor({ notifyGateway, referralGateway, logger }) {
    this.notifyGateway = notifyGateway;
    this.referralGateway = referralGateway;
    this.logger = logger;
  }

  async execute({ templateName, id }) {
    try {
      const templateId = process.env[templateName];
      let personalisation;
      if (templateName == TEMPLATE_NAMES.RESIDENT_STATUS_SMS) {
        const referral = await this.referralGateway.get({ id });

        if (referral == null) return { error: 'could not get a preview' };
        personalisation = {
          name: `${referral.resident.firstName}`,
          serviceName: `${referral.service.name}`,
          referrerName: `${referral.referrer.name}`
        };
      }
      const result = await this.notifyGateway.getTemplatePreview(templateId, personalisation);

      return { data: result.data.body };
    } catch (err) {
      this.logger.error('could not get the email preview', { id, err });
      return { error: 'could not get a preview' };
    }
  }
}
