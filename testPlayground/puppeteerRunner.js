const { spawn } = require('child_process')
const { resolve } = require('path')
const { readdirSync } = require('fs')

const TESTS_FOLDER = 'tests/puppeteer'
const TEST_FILE_ENDING = '.spec.js'

process.env.DEBUG = 'puppeteer:*'

const absolutePathToTestDir = resolve(TESTS_FOLDER)

const testFileNames = readdirSync(absolutePathToTestDir).filter(
  (fileName) => fileName.indexOf(TEST_FILE_ENDING) >= 1,
)

console.log(`

Test directory: ${absolutePathToTestDir}

Found test files:

${JSON.stringify(testFileNames, null, 2)}
`)

function runTest(fileName, testDir) {
  return new Promise((resolve, reject) => {
    const testRun = spawn('node', [fileName], {
      cwd: testDir,
      shell: true,
      stdio: 'inherit',
    })

    testRun.on('close', () => {
      resolve()
    })

    testRun.on('error', (error) => {
      reject(error)
    })
  })
}

const DELIMITER = '_'.repeat(120)

async function run() {
  for (const fileName of testFileNames) {
    console.log(`
${DELIMITER}

🚀 ${fileName}

${DELIMITER}
    `)
    await runTest(fileName, absolutePathToTestDir)
  }
}

run()
