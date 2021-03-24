import ReferralGateway from './gateways/referral-gateway';
import CreateReferral from './use-cases/create-referral';
import FindReferrals from './use-cases/find-referrals';
import GetReferral from './use-cases/get-referral';
import UpdateReferral from './use-cases/update-referral';
import { logger, withLogging } from './infrastructure/logging';
import AWS from 'aws-sdk';
import FindResources from './use-cases/find-resources';
import AirtableGateway from './gateways/airtable-gateway';
import GetPrompts from './use-cases/get-prompts';
import FindFssResources from './use-cases/find-fss-resources';
import FssResourcesGateway from './gateways/fss-resources-gateway';
import NotifyGateway from './gateways/notify-gateway';
import SendReferralEmail from './use-cases/send-referral-email';
import SendReferralReceiptEmail from './use-cases/send-referral-receipt-email';
import SendReferralResidentEmail from './use-cases/send-referral-resident-email';
import SendResidentReferralSms from './use-cases/send-resident-referral-sms';
import CreateConversation from './use-cases/create-conversation';

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

const resourcesGateway = new AirtableGateway({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || 'https://api.airtable.com',
  tableNames: process.env.AIRTABLE_TABLE_NAMES.split(',')
});

const promptsGateway = new AirtableGateway({
  apiKey: process.env.AIRTABLE_PROMPTS_API_KEY,
  baseId: process.env.AIRTABLE_PROMPTS_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || 'https://api.airtable.com',
  tableNames: process.env.AIRTABLE_PROMPTS_TABLE_NAME
});

const fssResourcesGateway = new FssResourcesGateway({
  baseUrl: process.env.FSS_PUBLIC_API_URL
});

const notifyGateway = new NotifyGateway({
  apiKey: process.env.GOV_NOTIFY_API_KEY
});

const findReferrals = withLogging(new FindReferrals({ referralGateway, logger }), logger);
const getReferral = withLogging(new GetReferral({ referralGateway, logger }), logger);
const updateReferral = withLogging(new UpdateReferral({ referralGateway, logger }), logger);
const findResources = withLogging(
  new FindResources({ resourcesGateway, resourceLogger }),
  resourceLogger
);

const getPrompts = withLogging(
  new GetPrompts({
    promptsGateway,
    tableName: process.env.AIRTABLE_PROMPTS_TABLE_NAME
  }),
  logger
);

const findFssResources = new FindFssResources({ fssResourcesGateway });

const sendReferralEmail = new SendReferralEmail({ notifyGateway });

const sendReferralReceiptEmail = new SendReferralReceiptEmail({ notifyGateway, logger });

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

const createConversation = withLogging(
  new CreateConversation({
    conversationsGateway: {},
    sendSignpostEmail: {},
    logger
  }),
  logger
);

export {
  createReferral,
  findReferrals,
  getReferral,
  createConversation,
  updateReferral,
  findResources,
  getPrompts,
  findFssResources,
  sendReferralEmail,
  sendReferralReceiptEmail
};
