#!/bin/bash

docker build -t covidscreener_client1.0 --build-arg environment=production ../
docker tag covidscreener_client1.0 creativ360/development:covidscreener_client1.0
docker push creativ360/development:covidscreener_client1.0