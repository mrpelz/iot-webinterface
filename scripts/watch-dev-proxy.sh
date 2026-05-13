#!/usr/bin/env bash

tmux \
	new-session "make -s watch_lint" \; \
	bind-key -n C-d run-shell "tmux list-panes -s -F \"#{l:#{pane_pid}}\" -f \"#{l:#{pane_start_command}}\" | xargs kill; tmux kill-session" \; \
	bind-key -n C-Down "select-pane -D" \; \
	bind-key -n C-Left "select-pane -L" \; \
	bind-key -n C-Right "select-pane -R" \; \
	bind-key -n C-Space "resize-pane -Z" \; \
	bind-key -n C-Up "select-pane -U" \; \
	set-option -w mouse on \; \
	set-option -w pane-active-border-style bold \; \
	set-option -w pane-border-status top \; \
	set-option -w pane-border-style fg=default \; \
	set-option -w remain-on-exit on \; \
	set-option -w status off \; \
	set-option -p pane-border-format "eslint (eslint.config.json, includes files outside \"src\")" \; \
	split-window -h -l 66% "make -s util_mitmproxy" \; \
	set-option -p pane-border-format "mitmproxy" \; \
	split-window -h -l 50% "make -s watch_test" \; \
	set-option -p pane-border-format "jest (jest.config.json)" \; \
	split-window -f -v -l 50% "make -s watch_stylelint" \; \
	set-option -p pane-border-format "stylelint (stylelint.config.js)" \; \
	split-window -h -l 66% "make -s watch_build" \; \
	set-option -p pane-border-format "webpack (ts-loader with tsconfig.build.json, excludes test-files)" \; \
	split-window -h -l 50% "make -s watch_config" \; \
	set-option -p pane-border-format "tsc (tsconfig.meta.json, checks files outside \"src\")" \; \
	split-window -f -v -l 5 \; \
	set-option -p pane-border-format "input" \; \
