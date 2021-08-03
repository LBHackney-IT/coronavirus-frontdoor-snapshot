import { nanoid } from 'nanoid';
import { ArgumentError, Referral } from 'lib/domain';
import { createDomainModel, createReferralFromModel } from './models';
import { IsoDateTime } from '../domain/isodate';
import { REFERRAL_STATUSES } from 'lib/utils/constants';

class ReferralGateway {
  constructor({ client, tableName }) {
    this.client = client;
    this.tableName = tableName;
  }

  async create({
    resident,
    referrer,
    referralReason,
    conversationNotes,
    service,
    systemIds,
    emails,
    linkId,
    referenceNumber
  }) {
    if (!resident?.firstName) throw new ArgumentError('first name cannot be null.');
    if (!resident?.lastName) throw new ArgumentError('last name cannot be null.');

    const referral = new Referral({
      id: nanoid(8),
      resident,
      referrer,
      referralReason,
      conversationNotes,
      service,
      systemIds,
      emails,
      linkId,
      referenceNumber,
      statusHistory: [{ status: REFERRAL_STATUSES.Sent, date: IsoDateTime.now() }]
    });

    const request = {
      TableName: this.tableName,
      Item: createDomainModel(referral, Referral)
    };

    await this.client.put(request).promise();
    return referral;
  }

  async getReferralByLinkId({ linkId }) {
    console.log('Get referral: ', linkId);
    if (!linkId) throw new ArgumentError('linkId cannot be null.');

    const request = {
      TableName: this.tableName,
      ProjectionExpression:
        'id, firstName, lastName, statusHistory, referenceNumber, referrer, resident, service',
      FilterExpression: 'linkId = :linkId',
      ExpressionAttributeValues: {
        ':linkId': linkId
      }
    };

    const result = await this.client.scan(request).promise();
    if (result.Items.length === 0) return null;
    return createReferralFromModel(result.Items[0]);
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

  async find({ referrerEmail }) {
    if (!referrerEmail) throw new ArgumentError('referrer email cannot be null.');

    console.log(`Find endpoint called with: ${referrerEmail}`);
    const request = {
      TableName: this.tableName,
      ProjectionExpression:
        'id, firstName, lastName, statusHistory, referenceNumber, referrer, resident, service',
      FilterExpression: 'referredBy = :referredBy',
      ExpressionAttributeValues: {
        ':referredBy': referrerEmail
      }
    };

    const result = await this.client.scan(request).promise();
    if (result.Items.length === 0) return [];
    const sortReferralsByCreateDate = (s1, s2) => (s1.created < s2.created ? 1 : -1);

    const referrals = result.Items.map(item => createReferralFromModel(item)).sort(
      sortReferralsByCreateDate
    );
    return { referrals };
  }

  async update({ referral }) {
    if (!referral) throw new ArgumentError('referral cannot be null.');
    console.log('Updating referral: ', referral);

    const updateExpression = ['set statusHistory = :h'];

    const expressionAttributeValues = {
      ':h': referral.statusHistory
    };

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
