import CreateReferral from 'lib/use-cases/create-referral';

describe('Create Referral use case', () => {
  it('creates a new referral', async () => {
    const id = 1;
    const createdBy = 'Tina Turner';
    const dob = { day: 10, month: 12, year: 1980 };
    const firstName = 'Bart';
    const lastName = 'Simpson';
    const systemIds = ['xyz'];
    const referralGateway = {
      create: jest.fn(() => ({ id, firstName, lastName }))
    };
    const createReferral = new CreateReferral({ referralGateway });

    const result = await createReferral.execute({
      createdBy,
      dob,
      firstName,
      lastName,
      systemIds
    });

    expect(referralGateway.create).toHaveBeenCalledWith({
      createdBy,
      dob: `${dob.year}-${dob.month}-${dob.day}T00:00:00.000Z`,
      firstName,
      lastName,
      systemIds
    });
    expect(result).toEqual({ id, firstName, lastName });
  });
});
