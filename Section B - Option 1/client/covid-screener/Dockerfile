### STAGE 1: Build ###
FROM node:latest AS build

# Declare environment variable
ARG environment=development

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build $environment
### STAGE 2: Run ###
FROM nginx:latest
COPY --from=build /usr/src/app/dist/covid-screener /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf