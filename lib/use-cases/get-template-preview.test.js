import GetTemplatePreview from 'lib/use-cases/get-template-preview';
import { TEMPLATE_NAMES } from 'lib/utils/constants';

describe('Get template preview use case', () => {
  const referral = {
    id: 1,
    resident: { firstName: 'fname', lastName: 'lname' },
    service: { name: 'service-name' },
    referrer: { name: 'ref-name' }
  };
  let referralGateway = {
    get: jest.fn(() => referral)
  };

  const notifyGateway = {
    getTemplatePreview: jest.fn(() => {
      return {
        data: {
          body: 'result'
        }
      };
    })
  };
  process.env.REFERRAL_RESIDENT_STATUS_SMS_TEMPLATE_ID = 'xx';

  it('gets an sms template preview', async () => {
    const getTemplatePreview = new GetTemplatePreview({ notifyGateway, referralGateway });

    const result = await getTemplatePreview.execute({
      id: 1,
      templateName: TEMPLATE_NAMES.RESIDENT_STATUS_SMS
    });

    expect(referralGateway.get).toHaveBeenCalledWith({ id: 1 });
    expect(notifyGateway.getTemplatePreview).toHaveBeenCalledWith('xx', {
      name: `${referral.resident.firstName}`,
      serviceName: referral.service.name,
      referrerName: referral.referrer.name
    });

    expect(result).toEqual({ data: 'result' });
  });

  it('returns error if referral does not exist', async () => {
    referralGateway.get = jest.fn(() => null);
    const getTemplatePreview = new GetTemplatePreview({ notifyGateway, referralGateway });
    const result = await getTemplatePreview.execute({
      id: 1,
      templateName: TEMPLATE_NAMES.RESIDENT_STATUS_SMS
    });
    expect(result).toEqual({ error: 'could not get a preview' });
  });
});
