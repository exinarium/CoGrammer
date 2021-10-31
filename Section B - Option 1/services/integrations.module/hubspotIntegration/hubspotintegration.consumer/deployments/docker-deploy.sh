#!/bin/bash

docker build -t hubspotintegrationservice1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag hubspotintegrationservice1.0 creativ360/development:hubspotintegrationservice1.0
docker push creativ360/development:hubspotintegrationservice1.0