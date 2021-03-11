import { Referral } from 'lib/domain';

export function createReferralFromModel({ ...snapshotModel }) {
  return new Referral({
    ...snapshotModel
  });
}
