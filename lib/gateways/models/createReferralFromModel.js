import { Referral } from 'lib/domain';

export function createReferralFromModel({ ...referralModel }) {
  return new Referral({
    ...referralModel
  });
}
