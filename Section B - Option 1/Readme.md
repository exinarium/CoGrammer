# 2020 Screener

This is an app that I built last year that runs in the MEAN stack (Mongo, Express, Angular and Node). All the code is written in Typescript and currently runs on a production server. I did remove some of the config files as this is on a public repository for security reasons. The app does integration with Google Sheets, Active Campaign, Hubspot and Payfast. The app is built with multiple organizations in mind.

## Structure of the app

The app is built with microservices and an Angular UI. The UI is a progressive web app. The microservices all have monitoring on them using Prometheus and is deployed as individual docker containers on a VPS in the United States.

## How to access the app?

The app is running on the URL: https://2020screener.com

## How to build the app?

The app uses normal NPM install to access the packages. There are some packages that are included in the app, but is hosted on a private Azure directory. All packages needed are within the project files, so they can just be built and published to a private NPM server for your own use. If you struggle to build the app, please feel free to contact me in this regard.