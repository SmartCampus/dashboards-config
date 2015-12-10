#!/bin/bash
echo "this script should be executed in root mode"
echo "you should have npm ans bower installed"

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

cd "$parent_path"
cd back/format-data-service
npm install
cd ../sensor-containers-API
npm install
cd ../dashboard-generator
npm install
cd ../../front
npm install
bower install --allow-root
npm install -g forever
