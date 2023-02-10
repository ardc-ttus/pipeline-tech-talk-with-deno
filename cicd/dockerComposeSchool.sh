#!/bin/bash

echo "!!reminder: run this from root folder!!"

echo "spinning up the environment"
docker compose build && docker compose down && docker compose up
if [ $? -ne 0 ]; then    
    exit -1
fi
