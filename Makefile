include .env
include .env.local
export

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

STYLELINT := stylelint "src/{app,common}/**/*.{css,jsx,tsx}"
PACKAGE_LOCK_LINT_ARGS := $(PACKAGE_LOCK_LINT_ARGS) git.i.wurstsalat.cloud

MITM_TOKEN := $(shell uuidgen)

.PHONY: .PHONY \
	util_mitmproxy \
	watch_dev_proxy

check_commit:
	commitlint --verbose --config commitlint.config.mjs --last

check_package_lock:
	lockfile-lint --path npm-shrinkwrap.json --type npm $(PACKAGE_LOCK_LINT_ARGS)

util_mitmproxy:
	clear \

	@echo
	@echo http://localhost:8081/?token=$(MITM_TOKEN)
	@echo https://$(shell  uname -n)/
	@echo \

	mitmweb --no-web-open-browser --set termlog_verbosity=error --set web_password="$(MITM_TOKEN)" --mode "reverse:http://localhost:3000@443"

watch_dev_proxy:
	scripts/watch-dev-proxy.sh

watch_stylelint:
	nodemon --quiet --watch "src/**/*" --ext "css,jsx,tsx" \
		--exec 'clear; $(STYLELINT); exit 0'; \
	exit 0;
