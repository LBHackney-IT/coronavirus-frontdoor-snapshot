import { endpoint } from './index';
import createMockResponse from 'lib/api/utils/createMockResponse';

describe('Create Referral Api', () => {
  const createReferral = { execute: jest.fn() };
  const call = async ({ body, headers, method }) => {
    const response = createMockResponse();

    await endpoint({ createReferral })(
      {
        body,
        headers,
        method: method || 'POST'
      },
      response
    );

    return response;
  };

  it('can create a referral', async () => {
    const dateOfBirth = {};
    const firstName = 'sue';
    const lastName = 'taylor';
    const systemIds = ['xyz'];
    const email = 'Some@one.com';
    const address = '123 some road';
    const conversationNotes = 'nice chat';
    const referrerEmail = 'email@email.com';
    const referrerOrganisation = 'Hackney';
    const createdBy = 'Me';
    const phone = '0712345678';
    const postcode = 'SP1 2RM';
    const referralReason = 'needed tests';

    const response = await call({
      body: {
        createdBy,
        dateOfBirth,
        firstName,
        lastName,
        // systemIds,
        email,
        address,
        conversationNotes,
        phone,
        postcode,
        referralReason,
        referrerEmail,
        referrerOrganisation
      },
      headers: {}
    });
    expect(createReferral.execute).toHaveBeenCalledWith({
      dateOfBirth,
      createdBy,
      firstName,
      lastName,
      // systemIds,
      email,
      address,
      conversationNotes,
      phone,
      postcode,
      referralReason,
      referrerEmail,
      referrerOrganisation
    });
    expect(response.statusCode).toBe(201);
  });

  it('does not accept non-POST requests', async () => {
    const response = await call({ method: 'GET' });
    expect(response.statusCode).toBe(405);
  });

  describe('validation', () => {
    it('returns 400 when no firstName', async () => {
      const response = await call({
        body: {
          lastName: 'taylor',
          systemIds: ['xyz']
        }
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors.length).toBe(1);
    });

    it('returns 400 when no lastName', async () => {
      const response = await call({
        body: {
          firstName: 'sue',
          systemIds: ['xyz']
        }
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors.length).toBe(1);
    });

    xit('returns 400 when no systemIds', async () => {
      const response = await call({
        body: {
          firstName: 'sue',
          lastName: 'taylor',
          systemIds: []
        }
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors.length).toBe(1);
    });
  });

  it('returns a 500 for other errors', async () => {
    createReferral.execute = jest.fn(() => {
      throw new Error();
    });
    const response = await call({
      body: {
        firstName: 'sue',
        lastName: 'taylor',
        systemIds: ['xyz']
      }
    });
    expect(response.statusCode).toBe(500);
  });
});
