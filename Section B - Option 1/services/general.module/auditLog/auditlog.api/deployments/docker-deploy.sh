#!/bin/bash

docker build -t covidscreener_auditlogapi1.0 --build-arg NPM_TOKEN=${NPM_TOKEN} ../
docker tag covidscreener_auditlogapi1.0 creativ360/development:covidscreener_auditlogapi1.0
docker push creativ360/development:covidscreener_auditlogapi1.0