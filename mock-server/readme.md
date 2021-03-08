In order to use the mock server:

1. Set these env variables to the following values:

AIRTABLE_BASE_ID=baseId123
AIRTABLE_TABLE_NAMES=Service directory,Conversational Prompts
AIRTABLE_PROMPTS_TABLE_NAME=Conversational Prompts
AIRTABLE_BASE_URL=http://localhost:8085
FSS_PUBLIC_API_URL=http://localhost:8085/fss

2. From the project root directory

build this Docker image:

`docker-compose build airtable-stub`

And run it

`docker-compose up airtable-stub`

Or run:

`yarn start:mock`
