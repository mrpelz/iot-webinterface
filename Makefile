BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

check_commit:
	commitlint --verbose --config commitlint.config.mjs --last

transform_package_json_version:
	@:
