import NotifyGateway from './notify-gateway';
import nock from 'nock';

describe('NotifyGateway', () => {
  const expectedApiKey = 'keyXXXXXXXXXXXX';

  describe('#sendEmail', () => {
    it('sets correct headers and parameters for API calls', async () => {
      const notify = nock(/api.notify.com/)
        .get('send_email')
        .matchHeader('authorization', `Bearer ${expectedApiKey}`)
        .reply(200, { records: [] });

      const gateway = new NotifyGateway({
        apiKey: expectedApiKey
      });

      console.log(gateway)


      const res = await gateway.sendEmail();
    //   expect(notify.isDone()).toBe(true);
    expect(res).toBe(true);
    });
  });
});
