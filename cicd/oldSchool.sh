#!/bin/bash

echo "starting the pipeline"

# first let's see if everything is formated and linted properly
deno fmt --check
if [ $? -ne 0 ]; then    
    exit -1
fi
echo "fmt: pass"

# then let's see if the linter is happy
deno lint
if [ $? -ne 0 ]; then    
    exit -1
fi
echo "lint: pass"

# let's run some tests!
deno test -A
if [ $? -ne 0 ]; then    
    exit -1
fi
echo "test: pass"

# if we got here we're confident this api can run so #justDoIt
echo "ready to start the api #justDoIt"
exec deno run -A main.ts
