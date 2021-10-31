#!/bin/bash

docker build -t emailapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag emailapi1.0 creativ360/development:emailapi1.0
docker push creativ360/development:emailapi1.0 