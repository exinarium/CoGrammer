#!/bin/bash

docker build -t activecampaignintegrationapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag activecampaignintegrationapi1.0 creativ360/development:activecampaignintegrationapi1.0
docker push creativ360/development:activecampaignintegrationapi1.0