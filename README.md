# Coronavirus frontdoor Referral
This is a fork of the Housing vulnerabilities tools. 

## Getting started
This project uses **yarn** for dependency management and is built with Next.js.

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
   ```
6. Start running your local copy of understanding vulnerability.
   ```
   yarn dev
   ```

7. (Optional) add some test data: 
```
curl -X POST \
  http://localhost:3000/api/snapshots \
  -H 'content-type: application/json' \
  -d '{
"firstName" : "Sue",
"lastName" : "Taylor",
"dob": {},
"systemIds": ["123"],
"createdBy": "",
"postcode": "E1 6AW"
}'
```
which should return a `201` with a snapshot id like: `rrCN4o37`. Then browse to `http://localhost:3000/snapshots/rrCN4o37` to verify the page opens, if that is the case your local setup is complete.

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
INH_URL=https://inh-admin-test.hackney.gov.uk
AIRTABLE_API_KEY=xx
AIRTABLE_PROMPTS_TABLE_NAME="Conversational Prompts"
FSS_PUBLIC_API_URL=http://localhost:8085/fss
AIRTABLE_BASE_ID=baseId123
AIRTABLE_TABLE_NAMES="Service directory"
AIRTABLE_BASE_URL=http://localhost:8085
AIRTABLE_PROMPTS_API_KEY=xx
AIRTABLE_PROMPTS_BASE_ID=baseId456
HOTJAR_ID=12345
```

2. Build the application
```(bash)
yarn build
```

3. Run the tests:
To run in cypress UI:

Start the servers and run cyppress-open to launch cypress UI tool:

```(bash)
yarn start-test-servers
yarn cypress-open
```

To run headlessly (this will launch a local application copy and mock server for you):

```(bash)
yarn int-test
```

## Deployment
Infrastructure and code are deployed to AWS using Serverless.

### Automated deployments
Merging into `master` triggers an automated deployment into the staging environment.
To promote this to production you will need to manually approve the deployment in CircleCI.

## Pages and API endpoints
Login is handled by Support For Hackney Residents, so long as the Hackney token cookie is set users will be signed in here too.

### GET /api/snapshots/{id}
Retrieves a vulnerabilities snapshot, given a snapshot id.

### POST /api/snapshots/find
Used by other applications (such as Support For Hackney Residents) to find snapshots related to a particular person given their name, an optionally an array of identifiers.

### POST /api/snapshots
Creates a new, empty, vulnerabilities snapshot for a specified person.

### /loggedout
The page displayed when a user is logged out.

### /snapshots/{id}
Displays a vulnerability snapshot, if there is no data saved this will display the edit view - else it displays a readonly view of the snapshot.
