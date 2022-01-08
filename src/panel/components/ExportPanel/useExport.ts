import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { SLICE_NAMES, RootState } from 'store/index'

import { exportOptions } from './constants'
import exportProcessor from './exportProcessor'

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
  const [exportOption, setExportOption] = useState(exportOptions.none)

  const handleChange = useCallback((e) => {
    const value = e.target.value as exportOptions
    setExportOption(value)
  }, [])

  const recordedEvents = useSelector((state: RootState) => {
    const { activeTabID, events } = state[SLICE_NAMES.eventRecorder]
    return events[activeTabID] ?? []
  })

  const handleCopyToClipboard = () => {
    const { text } = exportProcessor(exportOption, recordedEvents)
    writeToClipboard(text)
  }

  const handleSaveToFile = () => {
    const { text, fileName } = exportProcessor(exportOption, recordedEvents)
    saveFile(text, fileName)
  }

  const areButtonsDisabled = exportOption === exportOptions.none

  return {
    exportOption,
    handleChange,
    areButtonsDisabled,
    handleCopyToClipboard,
    handleSaveToFile,
  }
}
