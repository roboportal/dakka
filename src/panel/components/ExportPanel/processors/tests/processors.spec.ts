import fs from 'fs'
import path from 'path'

import { CypressProcessor } from '../cypressProcessor'
import { PuppeteerProcessor } from '../puppeteerProcessor'
import { PlaywrightProcessor } from '../playwrightProcessor'

const IN_DIR_PATH = './data/in'
const OUT_DIR_PATH = './data/out'

const OUTPUT_SUFFIXES_MAP: Record<string, string> = {
  cypress: '_cy',
  puppeteer: '_pu',
  playwright: '_pl',
}

const cyProcessor = new CypressProcessor()
const puProcessor = new PuppeteerProcessor()
const plProcessor = new PlaywrightProcessor()

const processorsMap = {
  cypress: cyProcessor.process.bind(cyProcessor),
  puppeteer: cyProcessor.process.bind(puProcessor),
  playwright: cyProcessor.process.bind(plProcessor),
}

const inPath = path.resolve(__dirname, IN_DIR_PATH)
const outPath = path.resolve(__dirname, OUT_DIR_PATH)

const inputFiles = fs.readdirSync(inPath).filter((n) => n.indexOf('.json') > 0)
const inputNames = inputFiles.map((n) => n.replace('.json', ''))

const inputFilesAbsolutePaths = inputFiles.map((n) => path.resolve(inPath, n))

const inputDataTuple = inputFilesAbsolutePaths.map((p, index) => {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  return [inputNames[index], data]
})

if (process.env.UPDATE_OUT) {
  inputDataTuple.forEach(([testName, inputData]) => {
    Object.entries(processorsMap).forEach(([processorName, processor]) => {
      const testCaseEvents = {
        test: inputData,
      }

      const testCaseMeta = {
        describe: 'describe',
        selectedItId: 'test',
        its: [{ id: 'test', value: '' }],
      }

      const result = processor(testCaseEvents, testCaseMeta)

      const outputFileName = testName + OUTPUT_SUFFIXES_MAP[processorName]
      const outputFilePath = path.resolve(outPath, outputFileName)

      fs.writeFileSync(outputFilePath, result)
    })
  })
}

inputDataTuple.forEach(([testName, inputData]) => {
  describe(`block type: ${testName}`, () => {
    Object.entries(processorsMap).forEach(([processorName, processor]) => {
      it(`processor: ${processorName}`, async () => {
        const testCaseEvents = {
          test: inputData,
        }

        const testCaseMeta = {
          describe: 'describe',
          selectedItId: 'test',
          its: [{ id: 'test', value: '' }],
        }

        const result = processor(testCaseEvents, testCaseMeta)

        const outputFileName = testName + OUTPUT_SUFFIXES_MAP[processorName]
        const outputFilePath = path.resolve(outPath, outputFileName)

        const expected = await fs.promises.readFile(outputFilePath, 'utf8')

        expect(result).toStrictEqual(expected)
      })
    })
  })
})
