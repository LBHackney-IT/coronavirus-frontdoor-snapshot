import CreateConversation from 'lib/use-cases/create-conversation';

describe('Create Conversation use case', () => {
  let sendResidentSms;
  let sendResidentEmail;

  const id = 1;
  const userName = 'Tina Turner';
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
  const userEmail = 'email@email.com';
  const userOrganisation = 'Hackney';
  const signPostingMessage =
    'Hi Bart, I referred you to the garlic bread support service and suggested that you get in touch with the chocolate deliveries service';
  const discussedServices = [
    {
      id: 2,
      name: 'Garlic Bread Support',
      contactEmail: 'contact@gbs.com',
      referralEmail: 'referral@gbs.com',
      website: 'www.gbs.com',
      address: '123 Some st, E3 1J',
      referral: 'ABC121'
    },
    {
      id: 2,
      name: 'Chocolate Deliveries',
      contactEmail: 'contact@chocolatedeliveries.com',
      referralEmail: 'referral@chocolatedeliveries.com',
      website: 'www.chocolatedeliveries.com',
      address: '123 Other st, E3 1P'
    }
  ];

  const conversationsGateway = {
    create: jest.fn(() => ({
      id,
      firstName,
      lastName,
      email,
      phone,
      referralReason,
      conversationNotes,
      userName,
      userOrganisation,
      userEmail
    }))
  };
  const sendSignpostEmail = {
    execute: jest.fn(() => ({ response: { status: 300 } }))
  };
  const createConversation = new CreateConversation({
    conversationsGateway,
    sendSignpostEmail
  });

  beforeEach(() => {
    sendResidentSms = false;
    sendResidentEmail = false;
  });

  it('creates a new conversation', async () => {
    const result = await createConversation.execute({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth
      },
      user: {
        name: userName,
        organisation: userOrganisation,
        email: userEmail
      },
      discussedServices: discussedServices,
      signPostingMessage: signPostingMessage
    });

    expect(sendSignpostEmail.execute).toHaveBeenCalledWith({
      emailAddress: email,
      signPostingMessage
    });

    expect(conversationsGateway.create).toHaveBeenCalledWith({
      resident: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}T00:00:00.000Z`
      },
      discussedServices,
      signPostingMessage,
      user: {
        name: userName,
        organisation: userOrganisation,
        email: userEmail
      },
      systemIds: [],
      emails: {
        conversationEmailId: undefined
      }
    });

    expect(result).toEqual({
      id,
      errors: ['Failed to send sign posting email to resident']
    });
  });
});
