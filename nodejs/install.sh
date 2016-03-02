#!/bin/bash
echo "this script should be executed in root mode"
echo "you should have npm and bower installed"

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

npm install -g forever
npm install -g bower

cd "$parent_path"
cd back/format-data-service
npm install
cd ../sensor-containers-API
npm install
cd ../dashboard-generator
npm install
cd ../composition-engine
npm install
cd visualization-catalog
npm install
cd ../../../front
npm install
bower install --allow-root
