#!/bin/bash

echo "Welcome to the CovidScreener Service Template installer!"
echo ""
echo "Please enter the name of your service in camel case (eg. Logging)"
read serviceName

echo ""
echo "Please wait while we generate the template"
echo ""

serviceNameLower=${serviceName,,}

mkdir template

echo "Copying template files..."
echo ""
cp -R ~/Documents/source/CovidScreener/services/General.Module/Template/ConsumerProducerService/*yourservice* ./template
cd template

echo "Replacing file contents..."
echo ""
find . -type f -not -path "*/node_modules/*" -exec sed -i -e "s/yourservice/$serviceNameLower/g" {} +
find . -type f -not -path "*/node_modules/*" -exec sed -i -e "s/YourService/$serviceName/g" {} +

echo "Renaming files..."
echo ""
find . -depth -type f -not -path "*/node_modules/*" -execdir rename "s/yourservice/$serviceNameLower/g" {} +

echo "Renaming directories..."
echo ""
find . -depth -type d -not -path "*/node_modules/*" -execdir rename "s/yourservice/$serviceNameLower/g" {} +

cd ..
mv ./template/* .
rm -R template

echo "Installing Node packages..."
echo ""
find . -name package.json -not -path "*/node_modules/*" -exec bash -c "npm --prefix \$(dirname {}) install" \;

echo "Building all modules..."
echo ""
find . -name package.json -not -path "*/node_modules/*" -exec bash -c "npm --prefix \$(dirname {}) run build" \;

echo "Opening VSCode..."
echo ""
code .
