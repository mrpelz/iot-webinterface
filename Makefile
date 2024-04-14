BASE_FILE := $(shell npm ls --parseable --silent "@mrpelz/boilerplate-preact" 2>/dev/null)

include $(BASE_FILE)/Makefile

transform_package_json_version:
	@:
