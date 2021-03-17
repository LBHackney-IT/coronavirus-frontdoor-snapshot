import Token from './token';
import ArgumentError from './argument-error';

describe('Token', () => {
  it('sets the created date', async () => {
    const myIsoDate = '2020-05-14T12:01:58.000Z';
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date(myIsoDate).valueOf());

    const token = new Token({ token: 'TOKEN' });

    expect(token.createdDate).toEqual(myIsoDate);
  });

  it('throws an error if no token', () => {
    expect(() => new Token({})).toThrow(new ArgumentError('no token'));
  });
});
