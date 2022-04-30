import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectChangeEvent } from '@mui/material/Select'

import { INTERACTIVE_ELEMENT } from '@roboportal/constants/messageTypes'
import { IEventBlock } from '@roboportal/types'

import {
  selectEventSelector,
  selectIframeEventSelector,
} from '@/store/eventRecorderSlice'
import { getActiveTabId } from '@/store/eventSelectors'

import { CommonSelector } from './CommonSelector'

interface ISelectorProp {
  record: IEventBlock
  width: string
}

export function Selector({ record, width }: ISelectorProp) {
  const dispatch = useDispatch()

  const activeTabID = useSelector(getActiveTabId)

  const validSelectors = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.validSelectors
        : record.validSelectors,
    [record],
  )

  const selectorsHighPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 1 && closest !== 1,
      ),
    [validSelectors],
  )

  const selectorsMediumPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 2 && closest !== 1,
      ),
    [validSelectors],
  )

  const selectorsLowPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 3 && closest !== 1,
      ),
    [validSelectors],
  )

  const closestSelectors = useMemo(
    () =>
      validSelectors?.filter(
        ({ closest, priority }) =>
          closest === 1 && (priority === 2 || priority === 1),
      ),
    [validSelectors],
  )

  const selectedSelector = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.selectedSelector?.value
        : record?.selectedSelector?.value,
    [record],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = validSelectors?.find(
        (s: { value: string }) => s.value === e.target.value,
      )

      if (selector) {
        dispatch(
          selectEventSelector({
            selectedSelector: selector,
            record,
            tabId: activeTabID,
          }),
        )
      }
    },
    [record, validSelectors, activeTabID, dispatch],
  )

  const validIframeSelectors = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.iframeDetails?.selectors
        : record.iframeDetails?.selectors,
    [record],
  )

  const iframeSelectorsHighPriority = useMemo(
    () => validIframeSelectors?.filter(({ priority }) => priority === 1),
    [validIframeSelectors],
  )

  const iframeSelectorsMediumPriority = useMemo(
    () => validIframeSelectors?.filter(({ priority }) => priority === 2),
    [validIframeSelectors],
  )

  const iframeSelectorsLowPriority = useMemo(
    () => validIframeSelectors?.filter(({ priority }) => priority === 3),
    [validIframeSelectors],
  )

  const selectedIframeSelector = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.selectedIframeSelector?.value
        : record?.selectedIframeSelector?.value,
    [record],
  )

  const handleIframeSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = validIframeSelectors?.find(
        (s: { value: string }) => s.value === e.target.value,
      )
      if (selector) {
        dispatch(
          selectIframeEventSelector({
            selectedSelector: selector,
            record,
            tabId: activeTabID,
          }),
        )
      }
    },
    [record, validIframeSelectors, activeTabID, dispatch],
  )

  const shouldHideSelectorPanel =
    !validSelectors?.length || !(record.shouldUseElementSelector ?? true)

  const isIframeSelectorVisible =
    (record.isInIframe && !!record.iframeDetails) ||
    (record?.element?.isInIframe && !!record?.element?.iframeDetails)

  return (
    <>
      {isIframeSelectorVisible && (
        <CommonSelector
          width={width}
          selectedSelector={selectedIframeSelector}
          handleSelectorChange={handleIframeSelectorChange}
          selectorsHighPriority={iframeSelectorsHighPriority}
          selectorsMediumPriority={iframeSelectorsMediumPriority}
          selectorsLowPriority={iframeSelectorsLowPriority}
        />
      )}
      {!shouldHideSelectorPanel && (
        <CommonSelector
          width={width}
          selectedSelector={selectedSelector}
          handleSelectorChange={handleSelectorChange}
          selectorsHighPriority={selectorsHighPriority}
          selectorsMediumPriority={selectorsMediumPriority}
          selectorsLowPriority={selectorsLowPriority}
          closestSelectors={closestSelectors}
        />
      )}
    </>
  )
}
