#!/bin/bash

docker build -t emailservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag emailservice1.0 creativ360/development:emailservice1.0
docker push creativ360/development:emailservice1.0