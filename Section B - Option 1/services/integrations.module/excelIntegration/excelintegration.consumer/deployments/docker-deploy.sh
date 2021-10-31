#!/bin/bash

docker build -t excelintegrationservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag excelintegrationservice1.0 creativ360/development:excelintegrationservice1.0
docker push creativ360/development:excelintegrationservice1.0