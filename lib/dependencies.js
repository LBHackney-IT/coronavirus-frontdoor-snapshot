import ReferralGateway from './gateways/referral-gateway';
import CreateReferral from './use-cases/create-referral';
import FindReferrals from './use-cases/find-referrals';
import GetReferral from './use-cases/get-referral';
import UpdateReferral from './use-cases/update-referral';
import { logger, withLogging } from './infrastructure/logging';
import AWS from 'aws-sdk';
import FindResources from './use-cases/find-resources';
import AirtableGateway from './gateways/airtable-gateway';
import FindFssResources from './use-cases/find-fss-resources';
import FssResourcesGateway from './gateways/fss-resources-gateway';
import NotifyGateway from './gateways/notify-gateway';
import SendReferralEmail from './use-cases/send-referral-email';
import SendReferralReceiptEmail from './use-cases/send-referral-receipt-email';
import SendReferralResponseEmail from './use-cases/send-referral-response-email';
import SendReferralResidentEmail from './use-cases/send-referral-resident-email';
import SendResidentReferralSms from './use-cases/send-resident-referral-sms';
import CreateConversation from './use-cases/create-conversation';
import ConversationsGateway from './gateways/conversations-gateway';
import SendSignpostEmail from './use-cases/send-signpost-email';
import SendSignpostLetter from './use-cases/send-signpost-letter';
import GetReferralByLinkId from './use-cases/get-referral-by-link-id';
import UpdateReferralStatus from './use-cases/update-referral-status';
import SendSignpostReceiptEmail from './use-cases/send-signpost-receipt-email';
import SendResidentMessage from './use-cases/send-resident-message';

// resources logs clog up the logs too much
const resourceLogger = {
  info: () => {
    console.log('resourceLogger INFO');
  },
  error: () => {
    console.log('resourceLogger ERROR');
  }
};

const dbConfig = {};
if (process.env.ENV !== 'production' && process.env.ENV !== 'staging') {
  dbConfig.region = 'localhost';
  dbConfig.endpoint = 'http://localhost:8000';
  dbConfig.accessKeyId = 'foo';
  dbConfig.secretAccessKey = 'bar';
}

const referralGateway = new ReferralGateway({
  client: new AWS.DynamoDB.DocumentClient(dbConfig),
  tableName: process.env.TABLE_NAME
});

const conversationsGateway = new ConversationsGateway({
  client: new AWS.DynamoDB.DocumentClient(dbConfig),
  tableName: process.env.CONVERSATIONS_TABLE_NAME
});

const resourcesGateway = new AirtableGateway({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || 'https://api.airtable.com',
  tableNames: process.env.AIRTABLE_TABLE_NAMES.split(',')
});

const fssResourcesGateway = new FssResourcesGateway({
  baseUrl: process.env.FSS_PUBLIC_API_URL
});

const notifyGateway = new NotifyGateway({
  apiKey: process.env.GOV_NOTIFY_API_KEY
});

const findReferrals = withLogging(new FindReferrals({ referralGateway, logger }), logger);
const getReferral = withLogging(new GetReferral({ referralGateway, logger }), logger);
const getReferralByLinkId = withLogging(
  new GetReferralByLinkId({ referralGateway, logger }),
  logger
);
const updateReferral = withLogging(new UpdateReferral({ referralGateway, logger }), logger);
const findResources = withLogging(
  new FindResources({ resourcesGateway, resourceLogger }),
  resourceLogger
);

const findFssResources = new FindFssResources({ fssResourcesGateway });

const sendReferralEmail = new SendReferralEmail({ notifyGateway });

const sendReferralReceiptEmail = new SendReferralReceiptEmail({ notifyGateway, logger });

const sendSignpostReceiptEmail = new SendSignpostReceiptEmail({ notifyGateway });

const sendReferralResponseEmail = new SendReferralResponseEmail({ notifyGateway, logger });

const sendReferralResidentEmail = new SendReferralResidentEmail({ notifyGateway, logger });

const sendResidentReferralSms = new SendResidentReferralSms({ notifyGateway, logger });

const createReferral = withLogging(
  new CreateReferral({
    referralGateway,
    sendReferralEmail,
    sendReferralReceiptEmail,
    sendReferralResidentEmail,
    sendResidentReferralSms,
    logger
  }),
  logger
);

const sendSignpostEmail = new SendSignpostEmail({ notifyGateway, logger });
const sendSignpostLetter = new SendSignpostLetter({ notifyGateway, logger });

const createConversation = withLogging(
  new CreateConversation({
    conversationsGateway,
    sendSignpostEmail,
    sendSignpostLetter,
    sendSignpostReceiptEmail,
    logger
  }),
  logger
);

const updateReferralStatus = withLogging(
  new UpdateReferralStatus({ updateReferral, sendReferralResponseEmail }),
  logger
);

const sendResidentMessage = withLogging(
  new SendResidentMessage({ notifyGateway, referralGateway, logger }),
  logger
);

export {
  createReferral,
  findReferrals,
  getReferral,
  getReferralByLinkId,
  createConversation,
  updateReferral,
  findResources,
  findFssResources,
  sendReferralEmail,
  sendReferralReceiptEmail,
  updateReferralStatus,
  sendResidentMessage
};
