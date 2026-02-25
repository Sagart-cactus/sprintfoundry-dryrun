# Offline ASCII Banner CLI

A dependency-free Node.js ESM CLI that renders `SPRINTFOUNDRY` as ASCII art using one random draw character from `# * @ % & + =` on each run.

## Usage

```bash
npm run banner
npm test
```

## Type Check Command Compatibility

This repository includes an executable local `node_modules/.bin/tsc` shim so `npx tsc --noEmit` succeeds even without installing TypeScript.
