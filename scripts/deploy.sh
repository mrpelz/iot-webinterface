#!/bin/bash

ssh root@hermes.net.wurstsalat.cloud << EOF
  cd /var/www/html/
  scripts/pull.sh
EOF
