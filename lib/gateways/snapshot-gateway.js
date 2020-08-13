import { nanoid } from 'nanoid';
import { ArgumentError, Snapshot } from 'lib/domain';
import { createSnapshotModel, createSnapshotFromModel } from './models';
import moment from 'moment';

class SnapshotGateway {
  constructor({ client, tableName }) {
    this.client = client;
    this.tableName = tableName;
  }

  async create({ createdBy, dob, firstName, lastName, systemIds, postcode }) {
    if (!firstName) throw new ArgumentError('first name cannot be null.');
    if (!lastName) throw new ArgumentError('last name cannot be null.');

    const snapshot = new Snapshot({
      id: nanoid(8),
      createdBy,
      dob,
      firstName,
      lastName,
      systemIds,
      postcode
    });

    snapshot.expires = moment().add(12, 'hours').unix();

    const request = {
      TableName: this.tableName,
      Item: createSnapshotModel(snapshot)
    };

    await this.client.put(request).promise();
    return snapshot;
  }

  async get({ id }) {
    if (!id) throw new ArgumentError('id cannot be null.');

    const request = {
      TableName: this.tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      }
    };

    const result = await this.client.query(request).promise();
    if (result.Items.length === 0) return null;
    return createSnapshotFromModel(result.Items[0]);
  }

  async find({ firstName, lastName, systemIds }) {
    if (!firstName) throw new ArgumentError('first name cannot be null.');
    if (!lastName) throw new ArgumentError('last name cannot be null.');

    const request = {
      TableName: this.tableName,
      IndexName: 'NamesIndex',
      KeyConditionExpression: 'queryLastName = :l and queryFirstName = :f',
      ExpressionAttributeValues: {
        ':l': lastName.toLowerCase(),
        ':f': firstName.toLowerCase()
      }
    };

    const { Items } = await this.client.query(request).promise();

    const matchBySystemId = s => {
      if (!s.systemIds || s.systemIds.length === 0) return true;
      return s.systemIds.some(id => systemIds.includes(id));
    };
    const matches = Items.filter(matchBySystemId);

    // because we're using a GSI to find, we need to then do a get
    // on each match to get the full data model back
    const snapshots = await Promise.all(matches.map(m => this.get(m)));

    const filterEmptySnapshots = s =>
      s.vulnerabilities.length > 0 || s.assets.length > 0 || s.notes.length > 0;

    const sortSnapshotsByCreateDate = (s1, s2) =>
      s1.created < s2.created ? 1 : -1;

    return {
      snapshots: snapshots
        .filter(filterEmptySnapshots)
        .sort(sortSnapshotsByCreateDate)
    };
  }

  async save({ snapshot }) {
    if (!snapshot) throw new ArgumentError('snapshot cannot be null.');

    // remove the dynamodb ttl on save
    delete snapshot.expires;

    const updateExpression = [
      'set assets = :a',
      'vulnerabilities = :v',
      'expires = :e'
    ];

    const expressionAttributeValues = {
      ':a': snapshot.assets,
      ':v': snapshot.vulnerabilities,
      ':e': null
    };

    if (snapshot.notes) {
      updateExpression.push('notes = :n');
      expressionAttributeValues[':n'] = snapshot.notes;
    }

    const request = {
      TableName: this.tableName,
      Key: { id: snapshot.id },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: updateExpression.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    };

    await this.client.update(request).promise();
    return snapshot;
  }
}

export default SnapshotGateway;
