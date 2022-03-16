import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IEventBlock, setExportType } from '@/store/eventRecorderSlice'
import {
  getActiveEvents,
  getExportType,
  getIsReadyToExport,
} from '@/store/eventSelectors'
import { exportOptions } from '@/store/utils/constants'
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
  const dispatch = useDispatch()
  const exportOption = useSelector(getExportType)

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value as exportOptions
      dispatch(setExportType(value))
    },
    [dispatch],
  )

  const recordedEvents = useSelector(getActiveEvents)
  const isReadyToExport = useSelector(getIsReadyToExport)

  const handleCopyToClipboard = () => {
    const { text } = exportProcessor(
      exportOption,
      recordedEvents as IEventBlock[],
    )
    writeToClipboard(text)
  }

  const handleSaveToFile = () => {
    const { text, fileName } = exportProcessor(
      exportOption,
      recordedEvents as IEventBlock[],
    )
    saveFile(text, fileName)
  }

  const areButtonsDisabled =
    exportOption === exportOptions.none ||
    !isReadyToExport ||
    !recordedEvents.length

  return {
    exportOption,
    handleChange,
    areButtonsDisabled,
    handleCopyToClipboard,
    handleSaveToFile,
  }
}
