#!/usr/bin/env bash

git reset --hard HEAD~1
git pull --ff-only origin HEAD

npm install --no-save --no-audit --no-fund
npm run build

systemctl restart iot-webinterface.service
echo "restart done"
