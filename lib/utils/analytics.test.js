import { getUserGroup } from './analytics.js';

describe('analytics', () => {
  describe('getUserGroup', () => {
    it('returns a correct user group if only one group given', () => {
      const groups = ['Better Conversations User Group 1'];
      const result = getUserGroup(groups);
      expect(result).toEqual('C19 Helpline');
    });

    it('returns a correct user group from multiple valid user groups', () => {
      const groups = ['asc', 'Better Conversations User Group 2'];
      const result = getUserGroup(groups);
      expect(result).toEqual('ASC Front Door');
    });

    it('returns a correct user group from multiple valid and invalid user groups', () => {
      const groups = ['other', 'Better Conversations User Group 4', 'random', 'ajfjksdnf'];
      const result = getUserGroup(groups);
      expect(result).toEqual('External');
    });

    it('returns null no valid groups exist', () => {
      const groups = ['asc-not', 'not-front'];
      const result = getUserGroup(groups);
      expect(result).toEqual(null);
    });
  });
});
