/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
//axe console printing
module.exports = (on, config) => {
  const clipboardy = require('clipboardy');
  const { DynamoDB } = require('aws-sdk');
  const client = new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'foo',
    secretAccessKey: 'bar'
  });

  on('task', {
    getClipboard() {
      return clipboardy.readSync();
    }
  });

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
    createReferral(referral) {
      return client
        .put({
          TableName: 'vulnerabilities',
          Item: referral
        })
        .promise();
    },
    deleteReferral(id) {
      return client
        .delete({
          TableName: 'vulnerabilities',
          Key: { id }
        })
        .promise();
    }
  });
  config.ignoreTestFiles = '**/examples/*.spec.js';
  return config;
};
