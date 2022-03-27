const fs = require('fs')
const path = require('path')

import { CypressProcessor } from '../src/panel/components/ExportPanel/processors/cypressProcessor'
import { PuppeteerProcessor } from '../src/panel/components/ExportPanel/processors/puppeteerProcessor'
import { PlaywrightProcessor } from '../src/panel/components/ExportPanel/processors/playwrightProcessor'

const OUT_DIR_PATH = '../../generated'

const OUTPUT_FOLDERS_MAP: Record<string, string> = {
  cypress: 'cypress',
  puppeteer: 'puppeteer',
  playwright: 'playwright',
}

const cyProcessor = new CypressProcessor()
const puProcessor = new PuppeteerProcessor()
const plProcessor = new PlaywrightProcessor()

const processorsMap = {
  cypress: cyProcessor.process.bind(cyProcessor),
  puppeteer: cyProcessor.process.bind(puProcessor),
  playwright: cyProcessor.process.bind(plProcessor),
}

const outPath = path.resolve(__dirname, OUT_DIR_PATH)

const inputDataTuple = [
  ['loadPage', require(path.resolve(__dirname, '../../mocks/loadPage.json'))],
]

inputDataTuple.forEach(([testName, inputData]) => {
  Object.entries(processorsMap).forEach(async ([processorName, processor]) => {
    const result = processor(inputData)

    const outputFileName = testName + '.spec.js'
    const outputDirPath = path.resolve(
      outPath,
      OUTPUT_FOLDERS_MAP[processorName],
    )

    const outputFilePath = path.resolve(
      outPath,
      OUTPUT_FOLDERS_MAP[processorName],
      outputFileName,
    )

    await fs.promises.mkdir(outputDirPath, { recursive: true })
    await fs.promises.writeFile(outputFilePath, result)
  })
})
