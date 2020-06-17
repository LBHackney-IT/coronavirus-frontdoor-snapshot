import SnapshotGateway from 'lib/gateways/snapshot-gateway';
import { ArgumentError, Snapshot } from 'lib/domain';

describe('SnapshotGateway', () => {
  let client;
  const tableName = 'vulnerabilities';

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
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      await expect(async () => {
        await snapshotGateway.create({ lastName: 'name' });
      }).rejects.toThrow(ArgumentError);

      expect(client.put).not.toHaveBeenCalled();
    });

    it('throws an error if lastName is not provided', async () => {
      const snapshotGateway = new SnapshotGateway({ client });

      await expect(async () => {
        await snapshotGateway.create({ firstName: 'name' });
      }).rejects.toThrow(ArgumentError);

      expect(client.put).not.toHaveBeenCalled();
    });

    it('can create a snapshot', async () => {
      const firstName = 'Trevor';
      const lastName = 'McLevor';

      const expectedRequest = {
        TableName: tableName,
        Item: expect.objectContaining({
          id: expect.any(String),
          firstName,
          lastName,
          queryFirstName: firstName.toLowerCase(),
          queryLastName: lastName.toLowerCase()
        })
      };
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      const result = await snapshotGateway.create({ firstName, lastName });

      expect(client.put).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Snapshot);
      expect(result.id).toStrictEqual(expect.any(String));
      expect(result.id.length).toBe(8);
      expect(result.firstName).toEqual(firstName);
      expect(result.lastName).toEqual(lastName);
    });
  });

  describe('get', () => {
    it('throws an error if id is null', async () => {
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      await expect(async () => {
        await snapshotGateway.get({ id: null });
      }).rejects.toThrow(ArgumentError);
      expect(client.query).not.toHaveBeenCalled();
    });

    it('can get a snapshot', async () => {
      const id = 1;
      const firstName = 'Trevor';
      const lastName = 'McLevor';

      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [{ id, firstName, lastName }] }))
      }));
      const expectedRequest = {
        TableName: tableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': id
        }
      };
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      const result = await snapshotGateway.get({ id });

      expect(client.query).toHaveBeenCalledWith(expectedRequest);
      expect(result).toBeInstanceOf(Snapshot);
      expect(result.id).toEqual(id);
      expect(result.firstName).toEqual(firstName);
      expect(result.lastName).toEqual(lastName);
    });

    it('can return null if snapshot does not exist', async () => {
      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [] }))
      }));
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      const result = await snapshotGateway.get({ id: 1 });

      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('throws an error if first name is missing', async () => {
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      await expect(async () => {
        await snapshotGateway.find({});
      }).rejects.toThrow('first name cannot be null.');
      expect(client.query).not.toHaveBeenCalled();
    });

    it('throws an error if last name is missing', async () => {
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      await expect(async () => {
        await snapshotGateway.find({ firstName: 'Linda' });
      }).rejects.toThrow('last name cannot be null.');
      expect(client.query).not.toHaveBeenCalled();
    });

    it('can find matching snapshots by name', async () => {
      const customerData = {
        id: '123',
        firstName: 'Barry',
        lastName: 'Jones'
      };

      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [customerData] }))
      }));

      const expectedRequest = {
        TableName: tableName,
        IndexName: 'NamesIndex',
        KeyConditionExpression: 'queryLastName = :l and queryFirstName = :f',
        ExpressionAttributeValues: {
          ':f': customerData.firstName.toLowerCase(),
          ':l': customerData.lastName.toLowerCase()
        }
      };

      const snapshotGateway = new SnapshotGateway({ client, tableName });

      const result = await snapshotGateway.find({
        firstName: customerData.firstName,
        lastName: customerData.lastName
      });

      expect(client.query).toHaveBeenCalledWith(expectedRequest);
      expect(result).toStrictEqual({ snapshotIds: ['123'] });
    });

    it('filters snapshots using system ids', async () => {
      const customerData = {
        firstName: 'Tom',
        lastName: 'Jones',
        systemIds: ['HH123456']
      };

      client.query.mockImplementation(request => {
        if (request.KeyConditionExpression === 'id = :id') {
          return {
            promise: () =>
              Promise.resolve({
                Items: [customerData]
              })
          };
        }

        return {
          promise: () =>
            Promise.resolve({
              Items: [
                {
                  id: '123',
                  firstName: customerData.firstName,
                  lastName: customerData.lastName,
                  systemIds: ['ABC123456']
                },
                {
                  id: '456',
                  firstName: customerData.firstName,
                  lastName: customerData.lastName,
                  systemIds: ['HH123456']
                }
              ]
            })
        };
      });

      const snapshotGateway = new SnapshotGateway({ client, tableName });
      const result = await snapshotGateway.find(customerData);
      expect(result).toEqual({ snapshotIds: ['456'] });
    });

    it('returns empty array when no matching snapshots', async () => {
      client.query = jest.fn(() => ({
        promise: jest.fn(() => ({ Items: [] }))
      }));
      const snapshotGateway = new SnapshotGateway({ client, tableName });

      const result = await snapshotGateway.find({
        firstName: 'Janos',
        lastName: 'Manos'
      });

      expect(result).toEqual({ snapshotIds: [] });
    });
  });
});