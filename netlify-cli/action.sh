#!/bin/bash

set -e
OUTPUT=$(bash -c "npx netlify-cli $*" | tr '\n' ' ')
set +e

NETLIFY_OUTPUT=$(echo "$OUTPUT")
echo $NETLIFY_OUTPUT

echo "netlify_output=$NETLIFY_OUTPUT" >> $GITHUB_OUTPUT
