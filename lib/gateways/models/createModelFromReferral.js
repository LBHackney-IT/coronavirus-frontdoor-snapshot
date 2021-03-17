import { Referral } from 'lib/domain';
import { normalise } from 'lib/utils/normalise';

function nullifyEmptyStrings(object) {
  if (!object) {
    return object;
  }

  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object') {
      object[key] = nullifyEmptyStrings(object[key]);
    } else if (object[key] === '') {
      object[key] = null;
    }
  });

  return object;
}

export function createReferralModel(referral) {
  if (!(referral instanceof Referral)) {
    throw new TypeError(`expected type Referral, but got ${referral?.constructor.name}`);
  }

  return nullifyEmptyStrings({
    ...referral,
    queryFirstName: normalise(referral.resident.firstName),
    queryLastName: normalise(referral.resident.lastName)
  });
}
