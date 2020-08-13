import '@testing-library/jest-dom/extend-expect';

global.console = {
  log: jest.fn(), // console.log are ignored in tests
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// These are required in order to initialise the Airtable API
// inside of `ResourcesGateway`. They need to be present before
// it is required inside of dependencies.js.
process.env = Object.assign(process.env, {
  AIRTABLE_API_KEY: 'not.a.real.api.key',
  AIRTABLE_BASE_ID: 'not.a.real.base.id',
  AIRTABLE_TABLE_NAMES: 'not.a.real.table.name',
  NEXT_PUBLIC_SINGLEVIEW_URL: 'https://staging-singleview.hackney.gov.uk',
  INH_URL: 'http://localhost:5000'
});
