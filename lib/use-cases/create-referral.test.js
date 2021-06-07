import CreateReferral from 'lib/use-cases/create-referral';

describe('Create Referral use case', () => {
  let sendResidentSms;
  let sendResidentEmail;

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
  const serviceContactPhone = '02098765434568';
  const serviceReferralEmail = 'referralservice@email.com';
  const serviceWebsite = 'www.service.com';
  const serviceAddress = '123 Some st, E3 1J';
  const serviceDescription = 'Good service';

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
  const sendReferralReceiptEmail = {
    execute: jest.fn(() => ({ response: { status: 300 } }))
  };
  const sendReferralResidentEmail = {
    execute: jest.fn(() => ({ response: { status: 300 } }))
  };
  const sendResidentReferralSms = {
    execute: jest.fn(() => ({ response: { status: 300 } }))
  };
  const createReferral = new CreateReferral({
    referralGateway,
    sendReferralEmail,
    sendReferralReceiptEmail,
    sendReferralResidentEmail,
    sendResidentReferralSms
  });

  beforeEach(() => {
    sendResidentSms = false;
    sendResidentEmail = false;
  });

  it('creates a new referral', async () => {
    const result = await createReferral.execute({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth
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
        referralEmail: serviceReferralEmail,
        contactPhone: serviceContactPhone,
        description: serviceDescription,
        websites: serviceWebsite,
        address: serviceAddress
      }
    });

    expect(referralGateway.create).toHaveBeenCalledWith({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}T00:00:00.000Z`
      },
      referrer: {
        name: referrerName,
        organisation: referrerOrganisation,
        email: referrerEmail
      },
      referralReason,
      conversationNotes,
      service: {
        address: serviceAddress,
        id: serviceId,
        name: serviceName,
        contactEmail: serviceContactEmail,
        referralEmail: serviceReferralEmail,
        description: serviceDescription,
        contactPhone: serviceContactPhone,
        websites: serviceWebsite
      },
      systemIds: [],
      emails: {
        referralEmailId: undefined,
        referralReceiptEmailId: undefined,
        referralResidentEmailId: undefined,
        residentReferralSmsId: undefined
      }
    });

    expect(sendReferralEmail.execute).toHaveBeenCalledWith({
      emailAddress: serviceReferralEmail,
      referral: {
        conversationNotes,
        email,
        name: `${firstName} ${lastName}`,
        phone,
        referralReason,
        referrerEmail,
        referrerName,
        referrerOrganisation
      }
    });

    expect(sendReferralReceiptEmail.execute).toHaveBeenCalledWith({
      emailAddress: referrerEmail,
      referral: {
        conversationNotes,
        email,
        name: `${firstName} ${lastName}`,
        phone,
        referralReason,
        serviceContactEmail: serviceContactEmail,
        serviceContactPhone: serviceContactPhone,
        serviceName: serviceName,
        serviceReferralEmail: serviceReferralEmail
      }
    });

    expect(result).toEqual({
      id,
      errors: [
        'Failed to send referral email to service',
        'Failed to send referral email receipt to referer'
      ]
    });
  });
  it('sends resident receipt if sendResidentSms is true', async () => {
    sendResidentSms = true;

    const result = await createReferral.execute(
      {
        resident: {
          firstName,
          lastName,
          phone,
          email,
          address,
          postcode,
          dateOfBirth
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
          referralEmail: serviceReferralEmail,
          contactPhone: serviceContactPhone,
          address: serviceAddress,
          websites: serviceWebsite
        }
      },
      sendResidentSms,
      sendResidentEmail
    );
    expect(sendResidentReferralSms.execute).toHaveBeenCalledTimes(1);
    expect(sendResidentReferralSms.execute).toHaveBeenCalledWith({
      phoneNumber: phone,
      referral: {
        name: `${firstName}`,
        referrerOrganisation,
        serviceName,
        serviceContactPhone,
        serviceAddress,
        serviceWebsite
      }
    });

    expect(result).toEqual({
      id,
      errors: [
        'Failed to send referral email to service',
        'Failed to send referral email receipt to referer',
        'Failed to send referral sms to resident'
      ]
    });
  });

  it('does not sent resident receipt if sendResidentSms is false or undefined', async () => {
    await createReferral.execute({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth
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
        referralEmail: serviceReferralEmail,
        contactPhone: serviceContactPhone
      }
    });
    expect(sendResidentReferralSms.execute).not.toHaveBeenCalled();
  });

  it('sends resident receipt if sendResidentEmail is true', async () => {
    sendResidentEmail = true;

    const result = await createReferral.execute(
      {
        resident: {
          firstName,
          lastName,
          phone,
          email,
          address,
          postcode,
          dateOfBirth
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
          referralEmail: serviceReferralEmail,
          contactPhone: serviceContactPhone,
          description: serviceDescription,
          address: serviceAddress,
          websites: serviceWebsite
        }
      },
      sendResidentSms,
      sendResidentEmail
    );

    expect(sendReferralResidentEmail.execute).toHaveBeenCalledTimes(1);
    expect(sendReferralResidentEmail.execute).toHaveBeenCalledWith({
      emailAddress: email,
      referral: {
        name: firstName,
        referrerEmail,
        serviceContactPhone,
        serviceName,
        serviceAddress,
        serviceDescription,
        referrerName,
        referrerOrganisation,
        serviceWebsite
      }
    });

    expect(result).toEqual({
      id,
      errors: [
        'Failed to send referral email to service',
        'Failed to send referral email receipt to referer',
        'Failed to send referral email receipt to resident'
      ]
    });
  });

  it('does not sent resident receipt if sendResidentSms is false or undefined', async () => {
    await createReferral.execute({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth
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
        referralEmail: serviceReferralEmail,
        contactPhone: serviceContactPhone
      }
    });
    expect(sendReferralResidentEmail.execute).not.toHaveBeenCalled();
  });
});
