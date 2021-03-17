import CreateReferral from 'lib/use-cases/create-referral';

describe('Create Referral use case', () => {
  it('creates a new referral', async () => {
    const id = 1;
    const createdBy = 'Tina Turner';
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
    const referralGateway = {
      create: jest.fn(() => ({
        id,
        firstName,
        lastName,
        email,
        phone,
        referralReason,
        conversationNotes,
        createdBy,
        referrerOrganisation,
        referrerEmail
      }))
    };
    const sendReferralEmail = {
      execute: jest.fn(() => ({ response: { status: 300 } }))
    };
    const createReferral = new CreateReferral({ referralGateway, sendReferralEmail });

    const result = await createReferral.execute({
      createdBy,
      dateOfBirth,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      systemIds,
      referrerEmail,
      referrerOrganisation
    });

    expect(referralGateway.create).toHaveBeenCalledWith({
      createdBy,
      dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}T00:00:00.000Z`,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      systemIds,
      referrerEmail,
      referrerOrganisation
    });

    expect(sendReferralEmail.execute).toHaveBeenCalledWith({
      email,
      referral: {
        conversationNotes,
        email,
        name: firstName,
        phone,
        referralReason,
        referrerEmail,
        referrerName: createdBy,
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
