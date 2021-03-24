import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Conversation Referral Api', () => {
  const createConversation = { execute: jest.fn() };
  const call = async ({ body, headers, method }) => {
    const response = createMockResponse();

    await endpoint({ createConversation })(
      {
        body,
        headers,
        method: method || 'POST'
      },
      response
    );

    return response;
  };

  it('can create a conversation', async () => {
    const dateOfBirth = {};
    const firstName = 'sue';
    const lastName = 'taylor';
    const systemIds = ['xyz'];
    const email = 'Some@one.com';
    const address = '123 some road';
    const userEmail = 'email@email.com';
    const userOrganisation = 'Hackney';
    const userName = 'Me';
    const phone = '0712345678';
    const postcode = 'SP1 2RM';
    const signPostingMessage =
      'Hi Sue, I referred you to the garlic bread support service and suggested that you get in touch with the chocolate deliveries service';
    const services = [
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

    const response = await call({
      body: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        userOrganisation,
        userName,
        userEmail,
        dateOfBirth,
        services,
        signPostingMessage
      },
      headers: {}
    });
    expect(createConversation.execute).toHaveBeenCalledWith({
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
      services: services,
      signPostingMessage: signPostingMessage,
      id: undefined,
      systemIds: undefined,
      created: expect.any(String)
    });
    expect(response.statusCode).toBe(201);
  });

  it('does not accept non-POST requests', async () => {
    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(405);
  });

  describe('validation', () => {
    it('returns 400 when no required fields are provided', async () => {
      const response = await call({ body: {} });
      expect(response.statusCode).toBe(400);
      const errors = JSON.parse(response.body).errors;
      expect(errors.length).toBe(5);
      expect(errors[0]).toBe('first name is required');
      expect(errors[1]).toBe('last name is required');
      expect(errors[2]).toBe('resident email is required');
      expect(errors[3]).toBe('services are required');
      expect(errors[4]).toBe('sign posting message is required');
    });
  });

  it('returns a 500 for other errors', async () => {
    createConversation.execute = jest.fn(() => {
      throw new Error();
    });
    const response = await call({
      body: {
        firstName: 'sue',
        lastName: 'taylor',
        userEmail: 'user@email.com',
        services: [{}],
        signPostingMessage: 'msg',
        email: 'resident@email.com'
      }
    });
    expect(response.statusCode).toBe(500);
  });
});
