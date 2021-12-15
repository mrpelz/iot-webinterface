#!/bin/bash

ssh root@iot-webinterface.mgmt.wurstsalat.cloud << EOF
  cd /opt/iot-webinterface/
  scripts/pull.sh
EOF
