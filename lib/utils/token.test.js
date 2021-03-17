import { getTokenFromCookieHeader, getTokenFromAuthHeader, getUsername } from 'lib/utils/token';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
jest.mock('jsonwebtoken');
jest.mock('cookie');

describe('Token', () => {
  describe('getTokenFromCookieHeader', () => {
    it('returns empty string if no cookie', () => {
      const result = getTokenFromCookieHeader({});
      expect(result).toEqual('');
    });

    it('returns empty string if no hackney token', () => {
      cookie.parse = cookie.parse.mockReturnValue({});
      const result = getTokenFromCookieHeader({ cookie: 'blah' });
      expect(result).toEqual('');
    });

    it('returns token', () => {
      cookie.parse = cookie.parse.mockReturnValue({ hackneyToken: 'TOKEN' });
      const result = getTokenFromCookieHeader({ cookie: 'blah' });
      expect(result).toEqual('TOKEN');
    });
  });

  describe('getTokenFromAuthHeader', () => {
    it('returns empty string if no auth header', () => {
      const result = getTokenFromAuthHeader({});
      expect(result).toEqual('');
    });

    it('returns token', () => {
      const result = getTokenFromAuthHeader({ authorization: 'Bearer XXXXX' });
      expect(result).toEqual('XXXXX');
    });
  });

  describe('getUsername', () => {
    it('returns name if token contains name', () => {
      jwt.decode.mockReturnValue({ name: 'Matt' });
      const result = getUsername('TOKEN');
      expect(result).toEqual('Matt');
    });

    it('returns falsy if cookie cant be decoded', () => {
      jwt.decode.mockReturnValue();
      const result = getUsername('TOKEN');
      expect(result).toBeFalsy();
    });

    it('returns falsy if no cookie', () => {
      const result = getUsername();
      expect(result).toBeFalsy();
    });
  });
});
