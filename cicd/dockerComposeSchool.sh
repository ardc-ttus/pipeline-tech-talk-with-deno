#!/bin/bash

echo "!!reminder: run this from root folder!!"

docker compose build
if [ $? -ne 0 ]; then    
    exit -1
fi
echo "compose build: pass"

echo "spinning up the environment"
docker compose down && docker compose up
if [ $? -ne 0 ]; then    
    exit -1
fi
