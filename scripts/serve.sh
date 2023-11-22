#!/usr/bin/env bash

if ! command -v nginx &>/dev/null; then
  echo "❌ \"nginx\" is not available, aborting"
  exit 1
fi

TIME=${1:-10000}

SIGUSR2_NO=$(kill -l SIGUSR2)
WAIT_STATUS_MATCH=$(("$SIGUSR2_NO" + 128))

handle_sigusr2() {
  kill -s HUP "$NGINX_PID" 2>/dev/null
  kill -s "$SIGUSR2_NO" "$NODE_PID" 2>/dev/null

	node -p "JSON.stringify({ id: require('crypto').randomUUID(), time: ${TIME}})" >"$PWD/dist/update.json"
}

trap handle_sigusr2 "$SIGUSR2_NO"

nginx -p "$PWD" -c nginx/main.conf -g "pid $(mktemp -d)/nginx.pid;" &
NGINX_PID=$!

esm-kit-serve-resolved-specifiers 9999 &
NODE_PID=$!

while :; do
  wait

  WAIT_STATUS=$?

  if [[ $WAIT_STATUS != "$WAIT_STATUS_MATCH" ]]; then
  	echo "non-SIGUSR2 received, exiting"

		kill "$NGINX_PID" 2>/dev/null
		kill "$NODE_PID" 2>/dev/null

    break
  fi

  echo "SIGUSR2 received, continuing"
done
