import SendResidentMessage from 'lib/use-cases/send-resident-message';

describe('Send resident status change sms use case', () => {
  const referral = {
    id: 1,
    resident: { firstName: 'jon', lastName: 'j', phone: '123' },
    service: { name: 'org name' },
    referrer: { name: '123' },
    emails: { existing: 'email' }
  };
  let notifyGateway = {
    sendSms: jest.fn(() => {
      return { response: { data: { id: 'success' } } };
    })
  };
  let referralGateway = {
    get: jest.fn(() => {
      return referral;
    }),
    update: jest.fn(() => {})
  };
  const logger = { error: jest.fn(() => {}) };

  process.env.REFERRAL_RESIDENT_STATUS_SMS_TEMPLATE_ID = 'xx';

  it('sends a status change sms to the resident', async () => {
    const sendResidentMessage = new SendResidentMessage({
      referralGateway,
      notifyGateway
    });
    await sendResidentMessage.execute({
      id: 1,
      sendBySms: true
    });

    expect(referralGateway.get).toHaveBeenCalledWith({ id: 1 });

    expect(notifyGateway.sendSms).toHaveBeenCalledWith('xx', '123', {
      name: referral.resident.name,
      serviceName: referral.service.name,
      referrerName: referral.referrer.name
    });

    expect(referralGateway.update).toHaveBeenCalledWith({
      id: referral.id,
      emails: { existing: 'email', residentStatusChangeSmsId: 'success' }
    });
  });

  it('does not send the message and update the referral if the referral does not exist', async () => {
    referralGateway.get = jest.fn(() => {
      return null;
    });

    const sendResidentMessage = new SendResidentMessage({
      referralGateway,
      notifyGateway,
      logger
    });
    await sendResidentMessage.execute({
      id: 1,
      sendBySms: true
    });

    expect(referralGateway.get).toHaveBeenCalledWith({ id: 1 });

    expect(notifyGateway.sendSms).not.toHaveBeenCalled();

    expect(referralGateway.update).not.toHaveBeenCalled();

    expect(logger.error).toHaveBeenCalledWith('No referral found by Id', { id: 1 });
  });

  it('does not send the message and update the referral sendBySms is false', async () => {
    const sendResidentMessage = new SendResidentMessage({
      referralGateway,
      notifyGateway,
      logger
    });
    await sendResidentMessage.execute({
      id: 1,
      sendBySms: false
    });

    expect(notifyGateway.sendSms).not.toHaveBeenCalled();

    expect(referralGateway.update).not.toHaveBeenCalled();
  });

  it('catches and loggs errors', async () => {
    referralGateway.get = jest.fn(() => {
      throw new Error('fail');
    });

    const sendResidentMessage = new SendResidentMessage({
      referralGateway,
      notifyGateway,
      logger
    });
    await sendResidentMessage.execute({
      id: 1,
      sendBySms: true
    });
    expect(logger.error).toHaveBeenCalledWith(
      'Error sending the status change message to the resident.',
      expect.anything()
    );
  });
});
