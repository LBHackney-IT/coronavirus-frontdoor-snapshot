import Resource from 'lib/domain/resource';

export function createResourceFromModel({ id, fields, categoryName, tag }) {
  const tags = fields.Categories?.concat(tag || []);

  return new Resource({
    id: id,
    name: fields.Name,
    description: fields['Referral details'],
    websites: fields.Websites?.split(','),
    address: fields.Address,
    postcode: fields['Post code'],
    tags,
    coordinates: fields.Coordinates,
    telephone: fields.Telephone,
    email: fields.Email,
    referralContact: fields['Referral Email'],
    referralWebsite: fields['Referral Website'],
    categoryId: fields.id,
    serviceDescription: fields.Description,
    categoryName: categoryName
  });
}
