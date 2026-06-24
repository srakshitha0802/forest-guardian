#!/bin/bash

VITE_TEMP="node_modules/.vite-temp"
if [ -L "$VITE_TEMP" ]; then
    rm "$VITE_TEMP"
    mkdir -p "$VITE_TEMP"
elif [ ! -e "$VITE_TEMP" ]; then
    mkdir -p "$VITE_TEMP"
fi

# Use a local output dir; /workspace may not exist in all environments.
OUTPUT=$(npx vite build --minify false --logLevel error --outDir ./.dist 2>&1)

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "$OUTPUT"
fi

exit $EXIT_CODE
