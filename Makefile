include node_modules/@mrpelz/boilerplate-common/config/Makefile

# overrides

check_typescript:
	tsc --build tsconfig.json src/workers/tsconfig.json

transform_typescript:
	tsc --build tsconfig.build.json src/workers/tsconfig.build.json

watch_lint:
	chokidar --initial "**/*.js" "src/**/*.{js,ts,tsx}" --ignore "dist/**/*" --ignore "node_modules/**/*" --ignore "*.d.ts" --command "clear; eslint --ignore-pattern \"dist/**/*\" --ignore-pattern \"node_modules/**/*\" .; echo \"[waiting for changes…]\""

watch_typescript:
	tsc --build tsconfig.build.json src/workers/tsconfig.build.json --watch

# additionals

serve:
	scripts/serve.sh

watch_serve:
	scripts/serve.sh 1000 & SCRIPT_PID="$$!"; chokidar --initial "dist/**/*.js" "nginx/**/*" "static/**/*" --command "kill -s SIGUSR2 \"$$SCRIPT_PID\"" & wait
