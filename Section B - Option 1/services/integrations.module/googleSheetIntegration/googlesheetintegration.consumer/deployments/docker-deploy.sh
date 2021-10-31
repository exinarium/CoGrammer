#!/bin/bash

docker build -t googlesheetintegrationservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag googlesheetintegrationservice1.0 creativ360/development:googlesheetintegrationservice1.0
docker push creativ360/development:googlesheetintegrationservice1.0