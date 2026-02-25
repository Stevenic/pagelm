#!/usr/bin/env bash
npm run build && node studio/bin/pagelm-studio.js start "$@"
