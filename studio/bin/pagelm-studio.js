#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { startServer } from '../dist/server.js';

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        port: { type: 'string', short: 'p', default: '3000' },
        provider: { type: 'string', default: process.env.PAGELM_PROVIDER || 'anthropic' },
        'api-key': { type: 'string', default: process.env.PAGELM_API_KEY || '' },
        model: { type: 'string', default: process.env.PAGELM_MODEL || '' },
        debug: { type: 'boolean', default: false },
        'debug-page-updates': { type: 'boolean', default: false },
    },
});

const command = positionals[0];

if (command !== 'start') {
    console.log(`Usage: pagelm-studio start [options]

Options:
  -p, --port <port>        Port to listen on (default: 3000)
  --provider <name>        AI provider: anthropic, openai, azure, oss (default: anthropic)
  --api-key <key>          API key (or set PAGELM_API_KEY env var)
  --model <model>          Model name (e.g. claude-opus-4-6, gpt-4o)
  --debug                  Enable debug logging
  --debug-page-updates     Log full HTML output on each transform

Environment variables:
  PAGELM_PROVIDER          Default provider
  PAGELM_API_KEY           Default API key
  PAGELM_MODEL             Default model`);
    process.exit(command ? 1 : 0);
}

startServer({
    port: parseInt(values.port, 10),
    provider: values.provider,
    apiKey: values['api-key'],
    model: values.model,
    debug: values.debug,
    debugPageUpdates: values['debug-page-updates'],
});
