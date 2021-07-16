// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length
  }));

  cy.task('table', violationData);
}

import jwt from 'jsonwebtoken';

const setHackneyCookie = isValidGroup => {
  const group = isValidGroup ? 'housingneeds-singleview-beta' : 'some-other-group';
  const token = jwt.sign({ name: 'My name', groups: [group] }, 'a-secure-signature');
  cy.setCookie('hackneyToken', token, {
    url: 'http://localhost:3000',
    domain: 'localhost'
  });
};

const runCheckA11y = () => {
  cy.checkA11y(null, null, callback, { skipFailures: true });
};

const severityIndicators = {
  minor: '⚪',
  moderate: '🟡',
  serious: '🟠',
  critical: '🔴'
};
const callback = violations => {
  const threshold = 1;
  violations.forEach(violation => {
    const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','));

    Cypress.log({
      name: `${severityIndicators[violation.impact]} A11Y`,
      consoleProps: () => violation,
      $el: nodes,
      message: `[${violation.help}](${violation.helpUrl})`
    });

    violation.nodes.forEach(({ target }) => {
      Cypress.log({
        name: `🔧`,
        consoleProps: () => violation,
        $el: Cypress.$(target.join(',')),
        message: target
      });
    });
  });
  if (violations.length > threshold) {
    Cypress.log({
      name: `A11Y`,
      consoleProps: () => violations,
      $el: '',
      message: `Acessibility violations have exceeded the maximum threshold of ${threshold}`
    });
    assert.isTrue(violations.length < threshold);
  }
};

Cypress.Commands.add('terminalLog', terminalLog);
Cypress.Commands.add('setHackneyCookie', setHackneyCookie);
Cypress.Commands.add('runCheckA11y', runCheckA11y);
