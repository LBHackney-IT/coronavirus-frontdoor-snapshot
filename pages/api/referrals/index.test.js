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
    const referrerName = 'Me';
    const phone = '0712345678';
    const postcode = 'SP1 2RM';
    const referralReason = 'needed tests';
    const serviceId = 2;
    const serviceName = 'ABC service';
    const serviceContactEmail = 'abc@email.com';
    const serviceReferralEmail = 'referralservice@email.com';

    const response = await call({
      body: {
        firstName,
        lastName,
        phone,
        email,
        address,
        postcode,
        referralReason,
        conversationNotes,
        referrerOrganisation,
        referrerName,
        referrerEmail,
        dateOfBirth,
        serviceId,
        serviceName,
        serviceContactEmail,
        serviceReferralEmail
      },
      headers: {}
    });
    expect(createReferral.execute).toHaveBeenCalledWith({
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
        referralEmail: serviceReferralEmail
      },
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
      expect(errors.length).toBe(6);
      expect(errors[0]).toBe('first name is required');
      expect(errors[1]).toBe('last name is required');
      expect(errors[2]).toBe('service referral email is required');
      expect(errors[3]).toBe('resident email is required');
      expect(errors[4]).toBe('service id is required');
      expect(errors[5]).toBe('referrer email is required');
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
        referrerEmail: 'referrer@email.com',
        serviceId: 2,
        serviceReferralEmail: 'service_referrer@email.com',
        email: 'resident@email.com'
      }
    });
    expect(response.statusCode).toBe(500);
  });
});
