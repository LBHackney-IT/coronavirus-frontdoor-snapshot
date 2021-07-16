# Development

Like a lot of other projects at Hackney, this project uses Next.js written in Javascript. This means you'll need a familiarality with

- [Next.JS](https://nextjs.org/)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [React](https://reactjs.org/)

## Architecture

The diagram below shows the overall data flow between the various moving components for Better Conversations.

![Data Flows](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/LBHackney-IT/coronavirus-frontdoor-snapshot/master/docs/Data-Flow.iuml)

### AWS Accounts

This project is hosted in the Hackney AWS accounts, depending on the stage you're looking for.

- Production: `ProductionAPIs`
- Staging: `StagingAPIs`

![AWS Architecture](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/LBHackney-IT/coronavirus-frontdoor-snapshot/master/docs/infrastructure.iuml)

## Integration with other tools

There is currently an integration with the "I Need Help" tool.

While the "I Need Help" tool has been replaced by "Here To Help", the tool remains accessible.

It has an integration with Better Conversations as documented [here](https://docs.google.com/document/d/1jzpirzR3U8pDOwy_H-sI3jtZi9Or_2nPQH6nCW1lEuY/edit#heading=h.u4foorjj4xue)

## Authentication

A quick note on authentication before you get started. Users are authenticated using Google SSO and a cookie is stored
on the hackney.gov.uk domain.

In order to provide the cookie to the application you'll need to ensure that your localhost is accessible at localdev.hackney.gov.uk

Add this line to your hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`, Linux/Mac: `/etc/hosts`):

```
127.0.0.1	localdev.hackney.gov.uk
```

When you next launch the app, it should be on `http://localdev.hackney.gov.uk:3000`.

## Getting started

1. Install the project dependencies
   ```
   yarn
   ```
   and
   `mkdir dynamodblocal`
   if the 'dynamodblocal' directory does not exist.
2. Create a `.env` file based off of the `.env.sample` that exists.
3. [Set up DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
   or start a local dynamodb container with Docker like so: `docker-compose up`
4. Configure AWS cli with `aws configure`
5. Create local DynamoDB plans table
   ```bash
   aws dynamodb create-table --cli-input-json file://./config/tables/referrals.json --endpoint-url http://localhost:8000
   aws dynamodb create-table --cli-input-json file://./config/tables/conversations.json --endpoint-url http://localhost:8000 > /dev/null
   ```
6. Start running your local copy of the application.
   ```
   yarn dev
   ```
7. Open `http://localhost:3000` to verify the page opens, if that is the case your local setup is complete.

## Working with DynamoDB locally

If you need to view, edit or delete data from your local copy of DynamoDB when working on a feature
there is a useful admin tool you can run.

```(bash)
yarn dynamo-admin
```

## Testing

### Unit tests

Unit tests are written with Jest, we are using `@testing-library/react` for React component testing.

```(bash)
yarn unit-test
```

### Integration tests

Integration tests are written with Cypress.

To run integration tests:

1. Set these env variables to the following values:

```(bash)
AIRTABLE_API_KEY=xx
AIRTABLE_BASE_ID=baseId123
AIRTABLE_BASE_URL=http://localhost:8085
AIRTABLE_TABLE_NAMES="Service directory"
FSS_PUBLIC_API_URL=http://localhost:8085/fss
HOTJAR_ID=12345
INH_URL=https://inh-admin-test.hackney.gov.uk
```

You may need to also change the following variables, depending on your setup

```bash
NEXT_PUBLIC_URL=http://localdev.hackney.gov.uk:3000
NEXT_PUBLIC_API_URL=http://localdev.hackney.gov.uk:3000/api
```

2. Build the application

```(bash)
yarn build
```

3. Run the tests:
   To run in cypress UI:

Start the servers and run cypress-open to launch cypress UI tool:

```(bash)
yarn start-test-servers
yarn cypress-open
```

To run headless (this will launch a local application copy and mock server for you):

```(bash)
yarn int-test
```

## Deployment

Infrastructure and code are deployed to AWS using Serverless.

### Automated deployments

Merging into `master` triggers an automated deployment into the staging environment.
To promote this to production you will need to manually approve the deployment in CircleCI.

## Project Structure

Throughout this project, you will spot that test files live alongside the implementation. This makes it easy to navigate
to test files while developing.

- `/circleci` - Workflow, and job configuration for CircleCI
- `/components` - React Components that are composed onto pages
- `/config` - Configuration for DynamoDB
- `/cypress` - Integration UI tests
- `/docs` - Technical documentation for the application
- `/lib/api` - Common API libraries
- `/lib/domain` - Domain Objects
- `/lib/gateways` - Gateways to external services
- `/lib/use-cases` - Application specific command processors to deal with business logic
- `/lib/utils` - Miscellaneous helpers for the libraries
- `/mock-server` - A mock server for running tests against FSS and Airtable
- `/pages` - The heart of the application, including API endpoints
- `/public` - Any static assets
- `/router` - Custom router for managing requests

## Debugging

### To debug in VSCode

1. Add the following configuration to .vscode/launch.json file at the root of the project:

```(bash)
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Yarn Launch",
      "runtimeExecutable": "yarn",
      "cwd": "${workspaceFolder}",
      "runtimeArgs": ["debug"],
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "cwd": "${workspaceFolder}",
      "port": 9229,
      "stopOnEntry": false,
      "restart": true
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ],
  "compounds": [
    {
      "name": "Debug-Full",
      "configurations": ["Yarn Launch", "Attach", "Chrome"]
    }
  ]
}
```

2. Launch the application in debug mode by running 'Debug-Full' from debug view  
   <img width="323" alt="image" src="https://user-images.githubusercontent.com/54268893/125300357-d9a7a280-e321-11eb-9638-e2010a44ba7f.png">

3. Put breakpoints in the code and interact with the app through the chrome window that was opened by the debugger
   <img width="1053" alt="image" src="https://user-images.githubusercontent.com/54268893/125301124-926de180-e322-11eb-8c7c-62c08ca4f0c2.png">
4. Use debug console in VSCode to investigate the results at breakpoints
   <img width="1080" alt="image" src="https://user-images.githubusercontent.com/54268893/125300976-70745f00-e322-11eb-8220-f2cec794448a.png">
