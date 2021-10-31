#!/bin/bash

docker build -t expressgateway1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag expressgateway1.0 creativ360/development:expressgateway1.0
docker push creativ360/development:expressgateway1.0