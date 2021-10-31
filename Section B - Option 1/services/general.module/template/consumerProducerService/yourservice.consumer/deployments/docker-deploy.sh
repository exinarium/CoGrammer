#!/bin/bash

docker build -t yourserviceservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag yourserviceservice1.0 creativ360/development:yourserviceservice1.0
docker push creativ360/development:yourserviceservice1.0