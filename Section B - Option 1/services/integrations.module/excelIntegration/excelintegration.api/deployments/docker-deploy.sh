#!/bin/bash

docker build -t excelintegrationapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag excelintegrationapi1.0 creativ360/development:excelintegrationapi1.0
docker push creativ360/development:excelintegrationapi1.0