import Resource from 'lib/domain/resource';

// .filter() will ignore null or undefined values
const filterEmptyValues = item => item;

export function createResourceFromModel({ id, fields }) {
  const websites = [fields['Website 1'], fields['Website 2']].filter(
    filterEmptyValues
  );

  return new Resource({
    id: id,
    name: fields.Name,
    description: fields.Description,
    websites,
    address: fields.Address,
    postcode: fields.Postcode,
    tags: fields['Vulnerability snapshot tags'],
    coordinates: fields['Coordinates'],
    telephone: fields['Phone number'],
    openingTimes: fields['Opening Times'],
    currentProvision: fields['Current Provision'],
    email: fields['Email'],
    referralContact: fields['Referral Contact'],
    selfReferral: fields['Self Referral'],
    notes: fields['Notes']
  });
}
