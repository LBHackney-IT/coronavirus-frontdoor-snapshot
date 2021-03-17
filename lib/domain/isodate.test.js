import IsoDate, { IsoDateTime } from './isodate';
import MockDate from 'mockdate';

describe('IsoDate', () => {
  beforeEach(() => {
    MockDate.set('2003-01-02');
  });

  describe('today', () => {
    it('prints todays date in ISO8601 format', () => {
      expect(IsoDate.today()).toBe('2003-01-02');
    });
  });

  describe('parse', () => {
    it('prints the parsed date in ISO8601 format', () => {
      // JavaScript Date months are indexed from 0...
      expect(IsoDate.parse(new Date(2020, 2, 14))).toBe('2020-03-14');
    });

    it('accepts dates in other parseable formats', () => {
      expect(IsoDate.parse('2020-03-14')).toBe('2020-03-14');
      expect(IsoDate.parse('2020-03-14T14:15:16Z')).toBe('2020-03-14');
      expect(IsoDate.parse(1584144000000)).toBe('2020-03-14');
    });

    it('returns null if date is not parsable', () => {
      expect(IsoDate.parse('horse')).toEqual(null);
    });
  });
});

describe('IsoDateTime', () => {
  beforeEach(() => {
    MockDate.set('2003-01-02T04:05:06.789Z');
  });

  describe('now', () => {
    it('prints the current date and time in ISO8601 format', () => {
      expect(IsoDateTime.now()).toBe('2003-01-02T04:05:06.789Z');
    });
  });

  describe('parse', () => {
    it('prints the parsed datetime in ISO8601 format', () => {
      expect(IsoDateTime.parse(new Date(2020, 2, 14, 5, 6, 30, 123))).toBe(
        '2020-03-14T05:06:30.123Z'
      );
    });

    it('accepts datetimes in other parseable formats', () => {
      expect(IsoDateTime.parse('2003-01-02T04:05:06.789Z')).toBe('2003-01-02T04:05:06.789Z');
      expect(IsoDateTime.parse('2020-03-14')).toBe('2020-03-14T00:00:00.000Z');
      expect(IsoDateTime.parse(1584162390123)).toBe('2020-03-14T05:06:30.123Z');
    });

    it('returns null if datetime is not parsable', () => {
      expect(IsoDateTime.parse('horse')).toEqual(null);
    });
  });
});
