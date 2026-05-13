include .env
include .env.local
export

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

MITM_TOKEN := $(PKG_NAME)@$(PKG_VERSION)
MITM_HOST := $(PKG_NAME)@$(PKG_VERSION)

.PHONY: .PHONY \
	util_mitmproxy \
	watch_dev_proxy

check_commit:
	commitlint --verbose --config commitlint.config.mjs --last

util_mitmproxy:
	clear \

	@echo
	@echo http://localhost:8081/?token=$(MITM_TOKEN)
	@echo https://$(shell  uname -n)/
	@echo \

	mitmweb --no-web-open-browser --set termlog_verbosity=error --set web_password="$(MITM_TOKEN)" --mode "reverse:http://localhost:3000@443"

watch_dev_proxy:
	scripts/watch-dev-proxy.sh
