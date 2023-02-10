#!/bin/bash

echo "!!reminder: run this from root folder!!"

docker build -t="medal-api:latest" -f Dockerfile .
if [ $? -ne 0 ]; then    
    exit -1
fi
echo "docker build: pass"

echo "let's start the docker container!"
docker run -p "8888:8888" medal-api:latest