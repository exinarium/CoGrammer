#!/bin/bash

docker build -t googlesheetintegrationapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag googlesheetintegrationapi1.0 creativ360/development:googlesheetintegrationapi1.0
docker push creativ360/development:googlesheetintegrationapi1.0