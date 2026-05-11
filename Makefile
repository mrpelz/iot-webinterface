include .env
include .env.local
export

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

.PHONY: .PHONY \
	util_mitmproxy \
	watch_dev_proxy

check_commit:
	commitlint --verbose --config commitlint.config.mjs --last

util_mitmproxy:
	mitmweb --no-web-open-browser --mode reverse:http://localhost:3000@443

watch_dev_proxy:
	scripts/watch-dev-proxy.sh
