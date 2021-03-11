import SnapshotGateway from './gateways/snapshot-gateway';
import CreateSnapshot from './use-cases/create-snapshot';
import FindSnapshots from './use-cases/find-snapshots';
import GetSnapshot from './use-cases/get-snapshot';
import UpdateSnapshot from './use-cases/update-snapshot';
import { logger, withLogging } from './infrastructure/logging';
import AWS from 'aws-sdk';
import FindResources from './use-cases/find-resources';
import AirtableGateway from './gateways/airtable-gateway';
import GetPrompts from './use-cases/get-prompts'
import FindFssResources from './use-cases/find-fss-resources';
import FssResourcesGateway from './gateways/fss-resources-gateway';
import NotifyGateway from "./gateways/notify-gateway";
import SendEmail from "./use-cases/send-email";

// resources logs clog up the logs too much
const resourceLogger = {
  info: ()=> { console.log ("resourceLogger INFO") },
  error: ()=> { console.log ("resourceLogger ERROR") }
}

const dbConfig = {};
if (process.env.ENV !== 'production' && process.env.ENV !== 'staging') {
  dbConfig.region = 'localhost';
  dbConfig.endpoint = 'http://localhost:8000';
  dbConfig.accessKeyId = 'foo';
  dbConfig.secretAccessKey = 'bar';
}

const snapshotGateway = new SnapshotGateway({
  client: new AWS.DynamoDB.DocumentClient(dbConfig),
  tableName: process.env.VULNERABILITIES_TABLE_NAME
});

const resourcesGateway = new AirtableGateway({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || "https://api.airtable.com",
  tableNames: process.env.AIRTABLE_TABLE_NAMES.split(','),
});

const promptsGateway = new AirtableGateway({
  apiKey: process.env.AIRTABLE_PROMPTS_API_KEY,
  baseId: process.env.AIRTABLE_PROMPTS_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || "https://api.airtable.com",
  tableNames: process.env.AIRTABLE_PROMPTS_TABLE_NAME,
});

const fssResourcesGateway = new FssResourcesGateway({
  baseUrl: process.env.FSS_PUBLIC_API_URL
});

const notifyGateway = new NotifyGateway({
  apiKey: "process.env.NOTIFY_API_KEY"
});

const createSnapshot = withLogging(
  new CreateSnapshot({ snapshotGateway, logger}),
  logger
);
const findSnapshots = withLogging(
  new FindSnapshots({ snapshotGateway, logger}),
  logger
);
const getSnapshot = withLogging(
  new GetSnapshot({ snapshotGateway, logger }),
  logger
);
const updateSnapshot = withLogging(
  new UpdateSnapshot({ snapshotGateway, logger }),
  logger
);
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
)

const findFssResources =
  new FindFssResources({ fssResourcesGateway })

const sendEmail = withLogging(
    new SendEmail({ notifyGateway, logger}),
    logger
);

export {
  createSnapshot,
  findSnapshots,
  getSnapshot,
  updateSnapshot,
  findResources,
  getPrompts,
  findFssResources,
  sendEmail
};
