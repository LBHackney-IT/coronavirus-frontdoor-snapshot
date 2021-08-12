#!/bin/bash

#######################################
# Creates a table in dynamo database if the table doesn't already exist.
# Arguments:
#   Table name (matching the .json file name from ./config/tables/)
# Returns:
#   0 if operation successful, non-zero if unexpected error occurs.
#######################################
function create_table() {
    local LOC_TABLE_NAME=$1
    echo "Creating table: $LOC_TABLE_NAME"
    
    (aws dynamodb list-tables --endpoint-url http://localhost:8000 | grep -wq "\b$LOC_TABLE_NAME\b")
    local LOC_TABLE_FOUND=$?

    if [[ $LOC_TABLE_FOUND -eq 0 ]]; then
        echo -e 'Table already exists. Skipping creation.\n'
    else
        aws dynamodb create-table \
            --cli-input-json file://./config/tables/$LOC_TABLE_NAME.json \
            --endpoint-url http://localhost:8000 \
            > /dev/null \
            && echo -e 'Table successfully created.\n' \
            || (echo -e '\nAn error occured table was not created!\n' \
                && exit 1)
    fi

    exit 0
}

export -f create_table

declare -a TABLES_TO_CREATE=(
    "referrals"
    "conversations"
    )

echo "Setting-up test dynamo database."
echo -e "Creating tables...\n"

# Create the tables
printf "%s\n" "${TABLES_TO_CREATE[@]}" | xargs -n1 -I {} bash -c 'create_table "{}"'

echo -e "Inserting / refreshing records...\n"
echo "Inserting records to referrals table:"
# Insert the records from contents folder
# Or reset the existing ones
find ./config/tables/content/ -type f -exec aws dynamodb put-item \
    --table-name referrals \
    --item file://{} \
    --endpoint-url http://localhost:8000 \
    > /dev/null \;

echo "Records inserted/renewed."
