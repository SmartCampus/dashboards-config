#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

cd "$parent_path"
forever start back/format-data-service/app.js
forever start back/sensor-containers-API/app.js
forever start back/dashboard-generator/app.js
forever start back/composition-engine/app.js
forever start front/app.js
