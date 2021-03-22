import SendResidentReferralSms from 'lib/use-cases/send-resident-referral-sms';

describe('Send resident referral sms use case', () => {
  it('sends a referral sms to the resident', async () => {
    const phoneNumber = '07000000000';
    const referral = {
      name: 'jon',
      referrerOrganisation: 'ref org',
      serviceName: 'Help with things',
      serviceContactPhone: '02045678987',
      serviceAddress: 'Address',
      serviceWebsites: 'web'
    };
    const notifyGateway = {
      sendSms: jest.fn(() => {
        return 'success';
      })
    };
    process.env.REFERRAL_RESIDENT_SMS_TEMPLATE_ID = 'xx';
    const sendResidentReferralSms = new SendResidentReferralSms({
      notifyGateway
    });
    const result = await sendResidentReferralSms.execute({
      phoneNumber,
      referral
    });

    expect(notifyGateway.sendSms).toHaveBeenCalledWith('xx', phoneNumber, {
      name: referral.name,
      referrerOrganisation: referral.referrerOrganisation,
      serviceName: referral.serviceName,
      serviceContactPhone: referral.serviceContactPhone,
      serviceAddress: referral.serviceAddress,
      serviceWebsites: referral.serviceWebsites
    });
    expect(result).toEqual('success');
  });
});
