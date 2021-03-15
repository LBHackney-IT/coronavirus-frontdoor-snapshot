import CreateReferral from 'lib/use-cases/create-referral';

describe('Create Referral use case', () => {
  it('creates a new referral', async () => {
    const id = 1;
    const createdBy = 'Tina Turner';
    const dob = { day: '23', month: '02', year: '1980' };
    const firstName = 'Bart';
    const lastName = 'Simpson';
    const systemIds = ['xyz'];
    const address = '742 Evergreen Terrace';
    const conversationNotes = 'Something about Springfield';
    const email = 'elbarto@spingfield.io';
    const phone = '(939) 555-0113';
    const postcode = 'SP2 3MS';
    const referralReason = 'Marge was concerned';
    const referralGateway = {
      create: jest.fn(() => ({ id, firstName, lastName }))
    };
    const createReferral = new CreateReferral({ referralGateway });

    const result = await createReferral.execute({
      createdBy,
      dob,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      systemIds
    });

    expect(referralGateway.create).toHaveBeenCalledWith({
      createdBy,
      dob: `${dob.year}-${dob.month}-${dob.day}T00:00:00.000Z`,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      systemIds
    });
    expect(result).toEqual({ id, firstName, lastName });
  });
});
