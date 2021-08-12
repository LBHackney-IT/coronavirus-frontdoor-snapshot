#!/bin/bash

#######################################
# Creates a table in dynamo database if the table doesn't already exist.
# Arguments:
#   Table name (matching the .json file name from ./config/tables/)
# Returns:
#   0 if operation successful, non-zero if unexpected error occurs.
#######################################
function create_table() {
    echo $1
    local LOC_TABLE_NAME=$1
    echo "Creating table: $LOC_TABLE_NAME"
    
    (aws dynamodb list-tables --endpoint-url http://localhost:8000 | grep -wq "\b$LOC_TABLE_NAME\b")
    local LOC_TABLE_FOUND=$?

    if [[ $LOC_TABLE_FOUND -eq 0 ]]; then
        echo 'Table already exists. Skipping creation.'
    else
        aws dynamodb create-table \
            --cli-input-json file://./config/tables/$LOC_TABLE_NAME.json \
            --endpoint-url http://localhost:8000 \
            > /dev/null \
            && printf '\nTable successfully created.\n' \
            || (printf '\nAn error occured table was not created!\n' \
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
echo "Creating tables..."

# Create the tables
printf "%s\n" "${TABLES_TO_CREATE[@]}" | xargs -n1 -I {} bash -c 'create_table "{}"'

echo "Inserting / refreshing records."

# Insert the records from contents folder
# Or reset the existing ones
find ./config/tables/content/ -type f -exec aws dynamodb put-item \
    --table-name referrals \
    --item file://{} \
    --endpoint-url http://localhost:8000 \
    > /dev/null \;

echo "Records inserted/renewed."
