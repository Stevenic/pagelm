@echo off
npm run build && node studio\bin\pagelm-studio.js start %*
