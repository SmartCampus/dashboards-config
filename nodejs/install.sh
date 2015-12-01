#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

cd "$parent_path"
cd back
npm install
cd ../front
npm install
bower install --allow-root
npm install -g forever
