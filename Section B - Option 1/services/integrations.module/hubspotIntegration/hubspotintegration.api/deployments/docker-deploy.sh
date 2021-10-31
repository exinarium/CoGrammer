#!/bin/bash

docker build -t hubspotintegrationapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag hubspotintegrationapi1.0 creativ360/development:hubspotintegrationapi1.0
docker push creativ360/development:hubspotintegrationapi1.0