#!/bin/bash

ssh root@iot-webinterface.lan.wurstsalat.cloud << EOF
  cd /opt/iot-webinterface/
  scripts/pull.sh
EOF
