import SnapshotGateway from './gateways/snapshot-gateway';
import CreateSnapshot from './use-cases/create-snapshot';
import FindSnapshots from './use-cases/find-snapshots';
import GetSnapshot from './use-cases/get-snapshot';
import UpdateSnapshot from './use-cases/update-snapshot';
import { logger, withLogging } from './infrastructure/logging';
import AWS from 'aws-sdk';
import FindResources from './use-cases/find-resources';
import ResourcesGateway from './gateways/resources-gateway';

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

const resourcesGateway = new ResourcesGateway({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  baseUrl: process.env.AIRTABLE_BASE_URL || "https://api.airtable.com",
  tableNames: process.env.AIRTABLE_TABLE_NAMES.split(',')
});

const createSnapshot = withLogging(
  new CreateSnapshot({ snapshotGateway }),
  logger
);
const findSnapshots = withLogging(
  new FindSnapshots({ snapshotGateway }),
  logger
);
const getSnapshot = withLogging(
  new GetSnapshot({ snapshotGateway, logger }),
  logger
);
const updateSnapshot = withLogging(
  new UpdateSnapshot({ snapshotGateway }),
  logger
);
const findResources = withLogging(
  new FindResources({ resourcesGateway }),
  logger
);

export {
  createSnapshot,
  findSnapshots,
  getSnapshot,
  updateSnapshot,
  findResources
};
