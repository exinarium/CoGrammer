#!/bin/bash

docker build -t yourserviceapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag yourserviceapi1.0 creativ360/development:yourserviceapi1.0
docker push creativ360/development:yourserviceapi1.0