import NotifyGateway from './notify-gateway';
import { ArgumentError } from '../domain';

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn(() => {
    return {
      sendEmail: jest.fn(async () => {}),
      sendSms: jest.fn(async () => {}),
      sendLetter: jest.fn(async () => {})
    };
  })
}));

describe('NotifyGateway', () => {
  describe('#sendEmail', () => {
    it('calls the correct method with expected parameters', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');

      await gateway.sendEmail('templateId', 'ten@mail.com', 'something');
      expect(gateway.notify.sendEmail).toBeCalledWith('templateId', 'ten@mail.com', {
        personalisation: 'something',
        reference: null
      });
    });
    it('throws an error when paremeters are not set', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');
      await expect(gateway.sendEmail()).rejects.toThrow(ArgumentError);

      expect(gateway.notify.sendEmail).not.toHaveBeenCalled();
    });
  });
  describe('#sendSms', () => {
    it('calls the correct method with expected parameters', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');

      await gateway.sendSms('templateId', '07000000000', 'something');
      expect(gateway.notify.sendSms).toBeCalledWith('templateId', '07000000000', {
        personalisation: 'something',
        reference: null
      });
    });
    it('throws an error when paremeters are not set', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');
      await expect(gateway.sendSms()).rejects.toThrow(ArgumentError);

      expect(gateway.notify.sendSms).not.toHaveBeenCalled();
    });
  });
  describe('#sendLetter', () => {
    it('calls the correct method with expected parameters', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');

      await gateway.sendLetter('templateId', { something: 'works' });
      expect(gateway.notify.sendLetter).toBeCalledWith('templateId', {
        personalisation: { something: 'works' },
        reference: null
      });
    });
    it('throws an error when paremeters are not set', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');
      await expect(gateway.sendLetter()).rejects.toThrow(ArgumentError);

      expect(gateway.notify.sendLetter).not.toHaveBeenCalled();
    });
  });
});
