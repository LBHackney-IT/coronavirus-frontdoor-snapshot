In order to use the local airtable, please set your env variable to this test endpoints:

AIRTABLE_BASE_ID=baseId123
AIRTABLE_TABLE_NAMES=Service directory,Tools
AIRTABLE_BASE_URL=http://localhost:8080

then from the project root directory build this Docker image:

`docker-compose build`

And run it

`docker-compose up`