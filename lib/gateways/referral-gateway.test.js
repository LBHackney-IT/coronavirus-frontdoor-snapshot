import moment from 'moment';
import ReferralGateway from 'lib/gateways/referral-gateway';
import { ArgumentError, Referral } from 'lib/domain';
import MockDate from 'mockdate';

describe('ReferralGateway', () => {
  let client;
  const tableName = 'referrals';

  beforeEach(() => {
    client = {
      put: jest.fn(request => ({
        promise: jest.fn(() => ({ Items: [request.Item] }))
      })),
      query: jest.fn(() => ({ promise: jest.fn() })),
      update: jest.fn(() => ({ promise: jest.fn() }))
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

      const expectedRequest = {
        TableName: tableName,
        Item: expect.objectContaining({
          id: expect.any(String),
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
        }
      });

      expect(client.put).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Referral);
      expect(result.id).toStrictEqual(expect.any(String));
      expect(result.id.length).toBe(8);
      expect(result.resident.firstName).toEqual(firstName);
      expect(result.resident.lastName).toEqual(lastName);
    });

    xit('adds a ttl', async () => {
      //we don't want to remove referrals this needs to be deleted
      const now = '2020-01-01T04:05:00.000Z';
      MockDate.set(now);
      const then = moment(now)
        .add(12, 'hours')
        .unix();
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.create({
        firstName: 'Hello',
        lastName: 'Nasty'
      });

      expect(result.expires).toEqual(then);
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
    it('throws an error if first name is missing', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });

      await expect(async () => {
        await referralGateway.find({});
      }).rejects.toThrow('first name cannot be null.');
      expect(client.query).not.toHaveBeenCalled();
    });

    it('throws an error if last name is missing', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });

      await expect(async () => {
        await referralGateway.find({ firstName: 'Linda' });
      }).rejects.toThrow('last name cannot be null.');
      expect(client.query).not.toHaveBeenCalled();
    });

    it('can find matching referrals by name', async () => {
      const firstName = 'Sister';
      const lastName = 'Nancy';
      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [{}] }))
      }));
      const referralGateway = new ReferralGateway({ client, tableName });
      const expectedRequest = {
        TableName: tableName,
        IndexName: 'NamesIndex',
        KeyConditionExpression: 'queryLastName = :l and queryFirstName = :f',
        ExpressionAttributeValues: {
          ':f': firstName.toLowerCase(),
          ':l': lastName.toLowerCase()
        }
      };
      referralGateway.get = jest.fn(() => {
        return { assets: [], vulnerabilities: [], notes: '' };
      });

      await referralGateway.find({
        firstName,
        lastName
      });

      expect(client.query).toHaveBeenCalledWith(expectedRequest);
    });

    it('filters referrals using system ids', async () => {
      const systemId = 'HH123456';
      client.query.mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Items: [
                { id: '1', systemIds: ['xxxxxx'] },
                { id: '2', systemIds: [systemId] }
              ]
            })
        };
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      referralGateway.get = jest.fn(async s => {
        return {
          id: s.id,
          systemIds: s.systemIds,
          assets: [{}],
          vulnerabilities: [],
          notes: ''
        };
      });

      const result = await referralGateway.find({
        firstName: 'Hey',
        lastName: 'Hey',
        systemIds: [systemId]
      });

      expect(result.referrals.length).toEqual(1);
      expect(result.referrals[0].systemIds).toEqual([systemId]);
    });

    it('sorts referrals by date descending', async () => {
      const systemId = 'matching';
      client.query.mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Items: [
                {
                  id: 3,
                  systemIds: [systemId],
                  created: '2022-10-20T00:00:00.000Z'
                },
                {
                  id: 4,
                  systemIds: [systemId],
                  created: '2022-10-20T00:15:00.000Z'
                },
                {
                  id: 1,
                  systemIds: [systemId],
                  created: '2022-09-18T00:00:00.000Z'
                },
                {
                  id: 2,
                  systemIds: [systemId],
                  created: '2022-09-19T00:00:00.000Z'
                }
              ]
            })
        };
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      referralGateway.get = jest.fn(async s => {
        return {
          id: s.id,
          created: s.created,
          systemIds: s.systemIds,
          assets: [{}],
          vulnerabilities: [],
          notes: ''
        };
      });

      const result = await referralGateway.find({
        firstName: 'Hey',
        lastName: 'Hey',
        systemIds: [systemId]
      });

      expect(result.referrals[0].id).toEqual(4);
      expect(result.referrals[1].id).toEqual(3);
      expect(result.referrals[2].id).toEqual(2);
      expect(result.referrals[3].id).toEqual(1);
    });

    it('filters empty referrals', async () => {
      const systemId = 'matching';
      client.query.mockImplementation(() => {
        return {
          promise: () =>
            Promise.resolve({
              Items: [
                {
                  id: 3,
                  systemIds: [systemId],
                  vulnerabilities: []
                },
                {
                  id: 4,
                  systemIds: [systemId],
                  vulnerabilities: [{}]
                }
              ]
            })
        };
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      referralGateway.get = jest.fn(async s => {
        return {
          id: s.id,
          systemIds: s.systemIds,
          assets: [],
          vulnerabilities: s.vulnerabilities,
          notes: ''
        };
      });

      const result = await referralGateway.find({
        firstName: 'Hey',
        lastName: 'Hey',
        systemIds: [systemId]
      });
      expect(result).toEqual({
        referrals: [
          {
            id: 4,
            systemIds: [systemId],
            assets: [],
            vulnerabilities: [{}],
            notes: ''
          }
        ]
      });
    });

    it('returns empty array when no matching referrals', async () => {
      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [] }))
      }));
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.find({
        firstName: 'Janos',
        lastName: 'Manos'
      });

      expect(result).toEqual({ referrals: [] });
    });
  });

  describe('save (actually update)', () => {
    xit('saves the referral', async () => {
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
        conversationNotes: 'test dummies can not talk'
      });
      const expectedRequest = {
        TableName: tableName,
        Key: { id: referral.id },
        ConditionExpression: 'attribute_exists(id)',
        UpdateExpression: [
          'set assets = :a',
          'vulnerabilities = :v',
          'expires = :e',
          'notes = :n'
        ].join(', '),
        ExpressionAttributeValues: {
          ':e': null
        },
        ReturnValues: 'UPDATED_NEW'
      };
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.save({ referral });

      expect(client.update).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBe(referral);
    });

    it('removes the ttl on save', async () => {
      const referral = new Referral({
        id: 1,
        assets: ['an asset'],
        notes: '',
        vulnerabilities: ['a vulnerability']
      });
      referral.expires = 123;
      const referralGateway = new ReferralGateway({ client, tableName });

      const result = await referralGateway.save({ referral });

      expect(result.expires).toBeUndefined();
    });

    it('does not save notes when notes is empty', async () => {
      const referral = new Referral({
        id: 1,
        assets: ['an asset'],
        notes: '',
        vulnerabilities: ['a vulnerability']
      });
      const expectedRequest = {
        TableName: tableName,
        Key: { id: referral.id },
        ConditionExpression: 'attribute_exists(id)',
        UpdateExpression: ['set assets = :a', 'vulnerabilities = :v', 'expires = :e'].join(', '),
        ExpressionAttributeValues: {
          ':a': referral.assets,
          ':e': null,
          ':v': referral.vulnerabilities
        },
        ReturnValues: 'UPDATED_NEW'
      };
      const referralGateway = new ReferralGateway({ client, tableName });

      await referralGateway.save({ referral });

      expect(client.update).toHaveBeenCalledWith(expectedRequest);
    });

    it('throws an error if referral does not exist', async () => {
      client.update.mockImplementationOnce(() => {
        throw new Error();
      });
      const referralGateway = new ReferralGateway({ client, tableName });
      await expect(async () => {
        await referralGateway.save({ referral: {} });
      }).rejects.toThrow();
    });

    it('throws an error if referral is null', async () => {
      const referralGateway = new ReferralGateway({ client, tableName });
      await expect(async () => {
        await referralGateway.save({});
      }).rejects.toThrow('referral cannot be null.');
      expect(client.update).not.toHaveBeenCalled();
    });
  });
});
