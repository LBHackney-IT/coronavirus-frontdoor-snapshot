import ReferralGateway from 'lib/gateways/referral-gateway';
import { ArgumentError, Referral } from 'lib/domain';

describe('ReferralGateway', () => {
  let client;
  const tableName = 'referrals';

  beforeEach(() => {
    client = {
      put: jest.fn(request => ({
        promise: jest.fn(() => ({ Items: [request.Item] }))
      })),
      query: jest.fn(() => ({ promise: jest.fn() })),
      update: jest.fn(() => ({ promise: jest.fn() })),
      scan: jest.fn(() => ({ promise: jest.fn() }))
    };
  });

  describe('create', () => {
    it('throws an error if firstName is not provided', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });

      await expect(async () => {
        await referralGateway.create({ lastName: 'name' });
      }).rejects.toThrow(ArgumentError);

      expect(client.put).not.toHaveBeenCalled();
    });

    it('throws an error if lastName is not provided', async () => {
      const referralGateway = new ReferralGateway({ client });

      await expect(async () => {
        await referralGateway.create({ firstName: 'name' });
      }).rejects.toThrow(ArgumentError);

      expect(client.put).not.toHaveBeenCalled();
    });

    it('can create a referral', async () => {
      const firstName = 'Trevor';
      const lastName = 'McLevor';
      const conversationNotes = 'Good talk';
      const referralReason = 'Needs help';
      const referrerName = 'El';
      const serviceName = 'Here to help';
      const referenceNumber = '8G-E2L';

      const expectedRequest = {
        TableName: tableName,
        Item: expect.objectContaining({
          id: expect.any(String),
          linkId: expect.any(String),
          referenceNumber,
          statusHistory: [
            {
              status: 'SENT',
              date: expect.any(String)
            }
          ],
          resident: {
            firstName,
            lastName
          },
          referrer: {
            name: referrerName
          },
          referralReason,
          conversationNotes,
          service: {
            name: serviceName
          },
          queryFirstName: firstName.toLowerCase(),
          queryLastName: lastName.toLowerCase()
        })
      };
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.create({
        resident: {
          firstName,
          lastName
        },
        referrer: {
          name: referrerName
        },
        referralReason,
        conversationNotes,
        service: {
          name: serviceName
        },
        linkId: '123',
        referenceNumber
      });

      expect(client.put).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Referral);
      expect(result.id).toStrictEqual(expect.any(String));
      expect(result.id.length).toBe(8);
      expect(result.resident.firstName).toEqual(firstName);
      expect(result.resident.lastName).toEqual(lastName);
    });
  });

  describe('get', () => {
    it('throws an error if id is null', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });

      await expect(async () => {
        await referralGateway.get({ id: null });
      }).rejects.toThrow(ArgumentError);
      expect(client.query).not.toHaveBeenCalled();
    });

    it('can get a referral', async () => {
      const id = 1;
      const firstName = 'Trevor';
      const lastName = 'McLevor';

      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [{ id, resident: { firstName, lastName } }] }))
      }));
      const expectedRequest = {
        TableName: tableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': id
        }
      };
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.get({ id });

      expect(client.query).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Referral);
      expect(result.id).toEqual(id);
      expect(result.resident.firstName).toEqual(firstName);
      expect(result.resident.lastName).toEqual(lastName);
    });

    it('can return null if referral does not exist', async () => {
      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [] }))
      }));
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.get({ id: 1 });

      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('throws an error if referrer email is missing', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });

      await expect(async () => {
        await referralGateway.find({});
      }).rejects.toThrow('referrer email cannot be null.');
      expect(client.query).not.toHaveBeenCalled();
    });

    it('can find matching referrals by email', async () => {
      client.scan = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [{}] }))
      }));
      const referralGateway = new ReferralGateway({ client, tableName });
      const expectedRequest = {
        TableName: tableName,
        FilterExpression: 'referredBy = :referredBy',
        ProjectionExpression:
          'id, firstName, lastName, statusHistory, referenceNumber, referrer, resident, service, created',
        ExpressionAttributeValues: {
          ':referredBy': 'email'
        }
      };
      // referralGateway.get = jest.fn(() => {
      //   return {};
      // });

      await referralGateway.find({
        referrerEmail: 'email'
      });

      expect(client.scan).toHaveBeenCalledWith(expectedRequest);
    });

    it('sorts referrals by date descending', async () => {
      // const systemId = 'matching';
      client.scan.mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Items: [
                {
                  id: 3,
                  created: '2022-10-20T00:00:00.000Z'
                },
                {
                  id: 4,
                  created: '2022-10-20T00:15:00.000Z'
                },
                {
                  id: 1,
                  created: '2022-09-18T00:00:00.000Z'
                },
                {
                  id: 2,
                  created: '2022-09-19T00:00:00.000Z'
                }
              ]
            })
        };
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      // referralGateway.get = jest.fn(async s => {
      //   return {
      //     id: s.id,
      //     created: s.created,
      //   };
      // });

      const result = await referralGateway.find({
        referrerEmail: 'email'
      });

      expect(result.referrals[0].id).toEqual(4);
      expect(result.referrals[1].id).toEqual(3);
      expect(result.referrals[2].id).toEqual(2);
      expect(result.referrals[3].id).toEqual(1);
    });

    it('returns empty array when no matching referrals', async () => {
      client.scan = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [] }))
      }));
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.find({
        referrerEmail: 'Janos@mail.zz'
      });

      expect(result).toEqual({ referrals: [] });
    });
  });

  describe('update', () => {
    it('updates the statusHistory for the referral', async () => {
      const statusHistory = [
        { status: 'SENT', date: '02/03/2020' },
        { status: 'ACCEPTED', date: '03/03/2020' }
      ];
      const referral = new Referral({
        id: 1,
        createdBy: 'Luna',
        dob: '05/01/2021',
        firstName: 'Resident',
        lastName: 'BeingReffered',
        phone: '0712345673',
        email: 'resident@hackney.gov.uk',
        address: '123 Some rd',
        postcode: 'SP2 13N',
        referralReason: 'testing',
        conversationNotes: 'test dummies can not talk',
        statusHistory
      });
      const expectedRequest = {
        TableName: tableName,
        Key: { id: referral.id },
        ConditionExpression: 'attribute_exists(id)',
        UpdateExpression: 'set statusHistory = :h',
        ExpressionAttributeValues: {
          ':h': statusHistory
        },
        ReturnValues: 'UPDATED_NEW'
      };
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.update({ referral });

      expect(client.update).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBe(referral);
    });

    it('throws an error if referral does not exist', async () => {
      client.update.mockImplementationOnce(() => {
        throw new Error();
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      await expect(async () => {
        await referralGateway.update({ referral: {} });
      }).rejects.toThrow();
    });

    it('throws an error if referral is null', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });
      await expect(async () => {
        await referralGateway.update({});
      }).rejects.toThrow('referral cannot be null.');
      expect(client.update).not.toHaveBeenCalled();
    });
  });
});
