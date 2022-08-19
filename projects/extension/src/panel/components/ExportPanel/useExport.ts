import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { exportOptions } from '@roboportal/constants/exportOptions'

import { setExportType, setIsIncludeSelector } from '@/store/eventRecorderSlice'
import {
  getActiveTestCase,
  getActiveTestCaseEvents,
  getExportType,
  getIsIncludeSelector,
  getIsReadyToExport,
} from '@/store/eventSelectors'

import exportProcessor from './exportProcessor'
import {
  REQUEST_GENERATED_TEST,
  RESPOND_GENERATED_TEST,
} from '@roboportal/constants/messageTypes'

const writeToClipboard = (text: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.append(el)

    el.select()
    const success = document.execCommand('copy')
    el.remove()

    if (!success) {
      reject(new Error('Unable to write to clipboard, check permissions'))
      return
    }

    resolve(text)
  })

const saveFile = (text: string, fileName: string) => {
  const el = document.createElement('a')
  const b64 = btoa(unescape(encodeURIComponent(text)))
  el.download = fileName
  el.href = `data:application/octet-stream;charset=utf-16le;base64,${b64}`
  document.body.append(el)
  el.click()
  el.remove()
}

export default function useExports() {
  const dispatch = useDispatch()
  const exportOption = useSelector(getExportType)
  const isIncludeSelector = useSelector(getIsIncludeSelector)

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value as exportOptions
      dispatch(setExportType(value))
    },
    [dispatch],
  )

  const recordedTestCaseEvents = useSelector(getActiveTestCaseEvents)
  const testCaseMeta = useSelector(getActiveTestCase)

  const isReadyToExport = useSelector(getIsReadyToExport)

  useEffect(() => {
    const notifyActionPopup = () => {
      const text =
        isReadyToExport && exportOption !== exportOptions.none
          ? exportProcessor({
              type: exportOption,
              testCaseEvents: recordedTestCaseEvents,
              testCaseMeta: testCaseMeta,
              isIncludeSelector,
            }).text
          : ''

      chrome.runtime.sendMessage({
        id: chrome.runtime.id,
        type: RESPOND_GENERATED_TEST,
        payload: {
          text,
        },
      })
    }

    const messageHandler = (
      event: { type: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse()
      if (event.type === REQUEST_GENERATED_TEST) {
        notifyActionPopup()
      }
    }

    notifyActionPopup()

    chrome.runtime.onMessage.addListener(messageHandler)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [
    exportOption,
    isReadyToExport,
    recordedTestCaseEvents,
    testCaseMeta,
    isIncludeSelector,
  ])

  const handleCopyToClipboard = () => {
    const { text } = exportProcessor({
      type: exportOption,
      testCaseEvents: recordedTestCaseEvents,
      testCaseMeta: testCaseMeta,
      isIncludeSelector,
    })
    writeToClipboard(text)
  }

  const handleSaveToFile = () => {
    const { text, fileName } = exportProcessor({
      type: exportOption,
      testCaseEvents: recordedTestCaseEvents,
      testCaseMeta: testCaseMeta,
      isIncludeSelector,
    })
    saveFile(text, fileName)
  }

  const handleIncludeSelector = useCallback(
    (e) => {
      const value = e.target.checked
      dispatch(setIsIncludeSelector(value))
    },
    [dispatch],
  )

  const areButtonsDisabled =
    exportOption === exportOptions.none || !isReadyToExport // maybe add check that each test case is not empty

  return {
    exportOption,
    isIncludeSelector,
    handleChange,
    areButtonsDisabled,
    handleCopyToClipboard,
    handleSaveToFile,
    handleIncludeSelector,
  }
}
