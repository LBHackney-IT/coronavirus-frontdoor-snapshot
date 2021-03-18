import CreateReferral from 'lib/use-cases/create-referral';

describe('Create Referral use case', () => {
  it('creates a new referral', async () => {
    const id = 1;
    const referrerName = 'Tina Turner';
    const dateOfBirth = { day: '23', month: '02', year: '1980' };
    const firstName = 'Bart';
    const lastName = 'Simpson';
    const systemIds = ['xyz'];
    const address = '742 Evergreen Terrace';
    const conversationNotes = 'Something about Springfield';
    const email = 'elbarto@spingfield.io';
    const phone = '(939) 555-0113';
    const postcode = 'SP2 3MS';
    const referralReason = 'Marge was concerned';
    const referrerEmail = 'email@email.com';
    const referrerOrganisation = 'Hackney';
    const serviceId = 2;
    const serviceName = 'ABC service';
    const serviceContactEmail = 'abc@email.com';
    const serviceReferralEmail = 'referralservice@email.com'

    const referralGateway = {
      create: jest.fn(() => ({
        id,
        firstName,
        lastName,
        email,
        phone,
        referralReason,
        conversationNotes,
        referrerName,
        referrerOrganisation,
        referrerEmail
      }))
    };
    const sendReferralEmail = {
      execute: jest.fn(() => ({ response: { status: 300 } }))
    };
    const createReferral = new CreateReferral({ referralGateway, sendReferralEmail });

    const result = await createReferral.execute({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth,
      },
      referrer: {
        name: referrerName,
        organisation: referrerOrganisation,
        email: referrerEmail
      },
      referralReason,
      conversationNotes,
      service: {
        id: serviceId,
        name: serviceName,
        contactEmail: serviceContactEmail,
        referralEmail: serviceReferralEmail
      },
    });

    expect(referralGateway.create).toHaveBeenCalledWith({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}T00:00:00.000Z`,
      },
      referrer: {
        name: referrerName,
        organisation: referrerOrganisation,
        email: referrerEmail
      },
      referralReason,
      conversationNotes,
      service: {
        id: serviceId,
        name: serviceName,
        contactEmail: serviceContactEmail,
        referralEmail: serviceReferralEmail
      },
      systemIds: []
    });

    expect(sendReferralEmail.execute).toHaveBeenCalledWith({
      emailAddress: serviceReferralEmail,
      referral: {
        conversationNotes,
        email,
        name: firstName,
        phone,
        referralReason,
        referrerEmail,
        referrerName: referrerName,
        referrerOrganisation
      }
    });

    expect(result).toEqual({
      id,
      firstName,
      lastName,
      errors: ['Failed to send referral email to service']
    });
  });
});
