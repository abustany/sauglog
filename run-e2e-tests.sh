#!/bin/bash

set -e

on_exit() {
	if [ -n "$SERVE_PID" ]; then
		echo "Killing vite server ($SERVE_PID)"
		kill $SERVE_PID
	fi
}

trap on_exit EXIT

cd $(dirname $0)
yarn build --mode=e2e
yarn serve &
SERVE_PID=$!
yarn cypress run $*
