import { createResourceFromModel } from './createResourceFromModel';

describe('createResourceFromModel', () => {
  it('maps properties from an Airtable record', () => {
    const record = {
      id: 'dakjhksd8283',
      fields: {
        Name: 'Resource name',
        Description: 'This is a description',
        CategoryDescription: 'Category description',
        Websites: 'https://www.example.com',
        Address: '42 Wallaby Way, Sydney, S1',
        'Post code': 'S1',
        Categories: ['one','two','three'],
        Coordinates: '51.5365,-0.0802',
        Telephone: '077 123456',
        Email: 'a@gmail.com',
        'Referral Email': 'Adam@something',
        'Referral Website': 'Yes.test',
        Notes: 'some notes'
      },
      categoryName: 'one'
    };

    const expectedResponse = {
      address: '42 Wallaby Way, Sydney, S1',
      categoryId: undefined,
      categoryName: 'one',
      coordinates: '51.5365,-0.0802',
      description: 'Category description',
      email: 'a@gmail.com',
      id: 'dakjhksd8283',
      name: 'Resource name',
      postcode: 'S1',
      referralContact: 'Adam@something',
      referralWebsite: 'Yes.test',
      serviceDescription: 'This is a description',
      tags: ['one', 'two', 'three'],
      telephone: '077 123456',
      websites: ['https://www.example.com']
    };

    expect(createResourceFromModel(record)).toMatchObject(expectedResponse);
  });
});
