#!/usr/bin/env node

const version = process.argv[2] || ''

const versionRegex = /^\d+\.\d+\.\d+$/

if (!versionRegex.test(version)) {
  process.exit(1)
}
