import fs from 'fs'
import path from 'path'

import { CypressProcessor } from '@roboportal/export_processors/cypressProcessor'
import { PuppeteerProcessor } from '@roboportal/export_processors/puppeteerProcessor'
import { PlaywrightProcessor } from '@roboportal/export_processors/playwrightProcessor'

import generatedOnButton from './src/generatedAssertions'

import loadPage from './mocks/loadPage.json'
import clickByTestId from './mocks/clickByTestId.json'
import clickByText from './mocks/clickByText.json'
import clickByTagName from './mocks/clickByTagName.json'
import dblclickByTestId from './mocks/dblclickByTestId.json'
import inputValueAssertion from './mocks/inputValueAssertion.json'
import clickLinkNavigation from './mocks/clickLinkNavigation.json'
import tabLinkNavigation from './mocks/tabLinkNavigation.json'
import backspaceDeleteInput from './mocks/backspaceDeleteInput.json'
import checkboxClickAssertion from './mocks/checkboxClickAssertion.json'
import checkboxClick from './mocks/checkboxClick.json'
import fileUpload from './mocks/fileUpload.json'
const OUT_DIR_PATH = '../../../generated'

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
  ['loadPage', loadPage],
  ['clickByTestId', clickByTestId],
  ['clickByText', clickByText],
  ['clickByTagName', clickByTagName],
  ['dblclickByTestId', dblclickByTestId],
  ['inputValueAssertion', inputValueAssertion],
  ['clickLinkNavigation', clickLinkNavigation],
  ['tabLinkNavigation', tabLinkNavigation],
  ['backspaceDeleteInput', backspaceDeleteInput],
  ['checkboxClickAssertion', checkboxClickAssertion],
  ['checkboxClick', checkboxClick],
  ['fileUpload', fileUpload],
  ...generatedOnButton,
]

inputDataTuple.forEach(([testName, inputData]) => {
  Object.entries(processorsMap).forEach(async ([processorName, processor]) => {
    const testCaseEvents: any = {
      test: inputData,
    }

    const testCaseMeta = {
      describe: 'describe',
      selectedItId: 'test',
      its: [{ id: 'test', value: '' }],
    }

    const result = processor(testCaseEvents, testCaseMeta)

    const outputFileName =
      testName + (processorName === 'cypress' ? '.cy.js' : '.spec.js')
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
