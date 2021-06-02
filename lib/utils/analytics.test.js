import { getUserGroup } from './analytics.js';

describe('analyticcs', () => {
  describe('getUserGroup', () => {
    process.env.ALLOWED_GROUPS = 'inh';
    process.env.ASC_FRONTDOOR_USER_GROUP = 'front';
    process.env.ASC_INFORMATION_USER_GROUP = 'asc';
    process.env.EXTERNAL_USER_GROUP = 'external';

    it('returns a correct user group if only one group given', () => {
      const groups = ['inh'];
      const result = getUserGroup(groups);
      expect(result).toEqual('C19 Helpline');
    });

    it('returns a correct user group from multiple valid user groups', () => {
      const groups = ['asc', 'front'];
      const result = getUserGroup(groups);
      expect(result).toEqual('ASC Front Door');
    });

    it('returns a correct user group from multiple valid and invalid user groups', () => {
      const groups = ['other', 'external', 'random', 'ajfjksdnf'];
      const result = getUserGroup(groups);
      expect(result).toEqual('External');
    });

    it('returns a other user group if no valid groups exist', () => {
      const groups = ['asc-not', 'not-front'];
      const result = getUserGroup(groups);
      expect(result).toEqual('Other');
    });
  });
});
