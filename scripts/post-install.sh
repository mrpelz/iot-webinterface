#!/usr/bin/env bash

# patch --force --ignore-whitespace "node_modules/konsta/react/components/ListInput.js" << 'EOF'
# 194c194
# <     title: null,
# ---
# >     // title: null,
# EOF
