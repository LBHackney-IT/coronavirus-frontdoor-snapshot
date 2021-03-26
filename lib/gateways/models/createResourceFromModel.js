import Resource from 'lib/domain/resource';

export function createResourceFromModel({ id, fields, categoryName }) {
  return new Resource({
    id: id,
    name: fields.Name,
    description: fields['Relevant Support'],
    websites: fields.Websites?.split(','),
    address: fields.Address,
    postcode: fields['Post code'],
    tags: fields.Categories,
    coordinates: fields.Coordinates,
    telephone: fields.Telephone,
    email: fields.Email,
    referralContact: fields['Referral Email'],
    referralWebsite: fields['Referral Website'],
    categoryId: fields.id,
    serviceDescription: fields.Description,
    categoryName: categoryName,
    demographic: fields["Who's this for"],
    councilTags: fields.Organisation
  });
}
