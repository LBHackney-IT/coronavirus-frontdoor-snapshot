import { nanoid } from 'nanoid';
import { ArgumentError, Referral } from 'lib/domain';
import { createReferralModel, createReferralFromModel } from './models';
import moment from 'moment';

class ReferralGateway {
  constructor({ client, tableName }) {
    this.client = client;
    this.tableName = tableName;
  }

  async create({
    createdBy,
    firstName,
    lastName,
    phone,
    email,
    address,
    postcode,
    referralReason,
    conversationNotes,
    referrerOrganisation,
    referrerEmail,
    dateOfBirth
  }) {
    if (!firstName) throw new ArgumentError('first name cannot be null.');
    if (!lastName) throw new ArgumentError('last name cannot be null.');

    const referral = new Referral({
      id: nanoid(8),
      createdBy,
      firstName,
      lastName,
      phone,
      email,
      address,
      postcode,
      referralReason,
      conversationNotes,
      referrerOrganisation,
      referrerEmail,
      dateOfBirth
    });

    const request = {
      TableName: this.tableName,
      Item: createReferralModel(referral)
    };

    await this.client.put(request).promise();
    return referral;
  }

  async get({ id }) {
    console.log('Get referral: ', id);
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
    return createReferralFromModel(result.Items[0]);
  }

  async find({ firstName, lastName, systemIds }) {
    if (!firstName) throw new ArgumentError('first name cannot be null.');
    if (!lastName) throw new ArgumentError('last name cannot be null.');

    console.log(`Find endpoint called with: ${firstName} ${lastName} ${systemIds}`);
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
    console.log('Find endpoint has found: ', Items);

    const matchBySystemId = s => {
      if (!s.systemIds || s.systemIds.length === 0) return true;
      return s.systemIds.some(id => systemIds.includes(id));
    };
    const matches = Items.filter(matchBySystemId);

    // because we're using a GSI to find, we need to then do a get
    // on each match to get the full data model back
    const referrals = await Promise.all(matches.map(m => this.get(m)));

    const filterEmptyReferrals = s =>
      s.vulnerabilities.length > 0 || s.assets.length > 0 || s.notes.length > 0;

    const sortReferralsByCreateDate = (s1, s2) => (s1.created < s2.created ? 1 : -1);

    return {
      referrals: referrals.filter(filterEmptyReferrals).sort(sortReferralsByCreateDate)
    };
  }

  async save({ referral }) {
    if (!referral) throw new ArgumentError('referral cannot be null.');
    console.log('Saving referral: ', referral);
    // remove the dynamodb ttl on save
    delete referral.expires;

    const updateExpression = ['set assets = :a', 'vulnerabilities = :v', 'expires = :e'];

    const expressionAttributeValues = {
      ':a': referral.assets,
      ':v': referral.vulnerabilities,
      ':e': null
    };

    if (referral.notes) {
      updateExpression.push('notes = :n');
      expressionAttributeValues[':n'] = referral.notes;
    }

    const request = {
      TableName: this.tableName,
      Key: { id: referral.id },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: updateExpression.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    };

    console.log('Updating dynamo db with request: ', request);
    await this.client.update(request).promise();
    return referral;
  }
}

export default ReferralGateway;