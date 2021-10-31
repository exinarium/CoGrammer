#!/bin/bash

docker build -t activecampaignintegrationservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag activecampaignintegrationservice1.0 creativ360/development:activecampaignintegrationservice1.0
docker push creativ360/development:activecampaignintegrationservice1.0