import Conversation from 'lib/domain/conversation';

describe('Conversation', () => {
  it('sets the created date to the current date/time when no date is received', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date('2020-05-14T12:01:58.000Z').valueOf());

    const conversation = new Conversation({});

    expect(conversation.created).toEqual('2020-05-14T12:01:58.000Z');
  });

  it('sets the created date to the date received', () => {
    const created = '2019-12-17T00:00:00';
    const conversation = new Conversation({ created });
    expect(conversation.created).toEqual(created);
  });
});
