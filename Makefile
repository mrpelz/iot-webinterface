include .env
include .env.local

BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

STYLELINT := stylelint "src/{app,common}/**/*.{css,jsx,tsx}"
PACKAGE_LOCK_LINT_ARGS := $(PACKAGE_LOCK_LINT_ARGS) git.i.wurstsalat.cloud

GIT_BRANCH := $(shell git symbolic-ref --short HEAD)

export

.PHONY: .PHONY \
	check_package_json_iot_monolith_dependency \
	util_mitmproxy \
	util_slug \
	watch_dev_proxy

check_commit:
	commitlint --verbose --config commitlint.config.mjs --last

check_package_json_iot_monolith_dependency:
	npm pkg get "dependencies.@iot/iot-monolith" | sed -nr '/^"([0-9]+\.[0-9]+\.[0-9]+)"$$/{q1}'

check_package_lock:
	lockfile-lint --path npm-shrinkwrap.json --type npm $(PACKAGE_LOCK_LINT_ARGS)

check_package_json: \
	util_get_package_json \
	check_package_json_sort \
	check_package_json_repository \
	check_package_json_name \
	check_package_json_version \
	check_package_json_iot_monolith_dependency

util_mitmproxy:
	clear; \
	\
	SLUG=$$("scripts/slug.js"); \
	\
	echo; \
	echo "http://localhost:8081/?token=$$SLUG"; \
	echo "https://$$SLUG.localhost"; \
	echo; \
	\
	mitmweb --no-web-open-browser --set termlog_verbosity=error --set web_password="$$SLUG" --mode "reverse:http://localhost:3000@443";

util_slug:
	scripts/slug.js

watch_dev_proxy:
	scripts/watch-dev-proxy.sh

watch_stylelint:
	nodemon --quiet --watch "src/**/*" --ext "css,jsx,tsx" \
		--exec 'clear; $(STYLELINT); exit 0'; \
	exit 0;
