import Referral from 'lib/domain/referral';

describe('Referral', () => {
  it('sets the created date to the current date/time when no date is received', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-05-14T12:01:58.000Z').valueOf()
      );

    const referral = new Referral({});

    expect(referral.created).toEqual('2020-05-14T12:01:58.000Z');
  });

  it('sets the created date to the date received', () => {
    const created = '2019-12-17T00:00:00';
    const referral = new Referral({ created });
    expect(referral.created).toEqual(created);
  });
});
