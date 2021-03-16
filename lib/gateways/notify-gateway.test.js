import NotifyGateway from './notify-gateway';
import { ArgumentError } from "../domain";

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn(() => {
    return {
      sendEmail: jest.fn(async () => {})
    };
  })
}));

describe('NotifyGateway', () => {
  describe('#sendEmail', () => {
    it('calls the correct method with expected parameters', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');

      await gateway.sendEmail('templateId', 'ten@mail.com', 'something');
      expect(gateway.notify.sendEmail).toBeCalledWith(
        'templateId',
        'ten@mail.com',
        { personalisation: 'something', reference: null }
      );
    });
    it('throws an error when paremeters are not set', async () => {
      const gateway = new NotifyGateway('keyXXXXXXXXXXX');
      await expect(gateway.sendEmail()).rejects.toThrow(ArgumentError);

      expect(gateway.notify.sendEmail).not.toHaveBeenCalled();
    });
  });
});
