#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')
const inputVersion = process.argv[2] || ''

const versionRegex = /^\d+\.\d+\.\d+$/

if (!versionRegex.test(inputVersion)) {
  console.error('Invalid version format:', inputVersion)
  process.exit(1)
}

const parseVersions = (v) => v.split('.').map((n) => Number(n))

const [patchA, minorA, majorA] = parseVersions(version)
const [patchB, minorB, majorB] = parseVersions(inputVersion)

const isInputVersionGtExisting =
  majorB > majorA ||
  (majorB === majorA && minorB > minorA) ||
  (majorB === majorA && minorB === minorA && patchB > patchA)

if (!isInputVersionGtExisting) {
  console.log('Input version is not greater than current')
  process.exit(1)
}
