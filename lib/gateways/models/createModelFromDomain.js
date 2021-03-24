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

export function createDomainModel(object, objectClass) {
  if (!(object instanceof objectClass)) {
    throw new TypeError(`expected type Referral, but got ${object?.constructor.name}`);
  }

  return nullifyEmptyStrings({
    ...object,
    queryFirstName: normalise(object.resident.firstName),
    queryLastName: normalise(object.resident.lastName)
  });
}
