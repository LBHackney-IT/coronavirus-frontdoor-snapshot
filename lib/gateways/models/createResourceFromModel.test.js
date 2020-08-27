import { createResourceFromModel } from './createResourceFromModel';

describe('createResourceFromModel', () => {
  it('maps properties from an Airtable record', () => {
    const record = {
      id: 'dakjhksd8283',
      fields: {
        Name: 'Resource name',
        Description: 'This is a description',
        'Website 1': 'https://www.example.com',
        Address: '42 Wallaby Way, Sydney, S1',
        Postcode: 'S1',
        Tags: ['one', 'two', 'three'],
        Coordinates: '51.5365,-0.0802',
        'Phone number': '077 123456',
        'Opening Times': 'Mon-Fri',
        'Current Provision': '25',
        Email: 'a@gmail.com',
        'Referral Contact': 'Adam',
        'Self Referral': 'Yes',
        Notes: 'some notes'
      }
    };

    expect(createResourceFromModel(record)).toMatchSnapshot();
  });
  it('maps properties from an Airtable record with prompts', () => {
    const record = {
      id: 'rec1hMVCuHzXQ2Bk0',
      fields: {
        supportingInformation: 'It’s important to look after your health as not seeking support for your health condition could be extremely dangerous.',
        prompts: 'How is your health at the moment?',
        promptTags: ['Health']
      }
    };

    expect(createResourceFromModel(record)).toMatchSnapshot();
  });
});
