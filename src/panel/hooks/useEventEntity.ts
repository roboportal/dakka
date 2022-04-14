import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { internalEventsMap } from '@/constants/internalEventsMap'
import { resize } from '@/constants/browserEvents'

import { ASSERTION } from '@/constants/actionTypes'
import { REDIRECT_STARTED, INTERACTIVE_ELEMENT } from '@/constants/messageTypes'

import {
  setActiveBlockId,
  setExpandedId,
  setCustomAssertSelector,
  IEventBlock,
} from '@/store/eventRecorderSlice'
import { getLastSelectedEventId } from '@/store/eventSelectors'

import useElementSelect from '@/hooks/useElementSelect'

import { truncate } from '@/utils/string'
import { assertionTypes } from '@/constants/assertion'

export default function useEventEntity(
  record: IEventBlock,
  isExpanded: boolean,
) {
  const [isAddCustomSelector, setIsAddCustomSelector] = useState(false)
  const [isSelectElement, setIsSelectElement] = useState(false)

  const { enableSelectElement, disableSelectElement } = useElementSelect()

  const dispatch = useDispatch()

  const lastSelectedEventId = useSelector(getLastSelectedEventId)

  const handleSetActiveBlockId = useCallback(
    (payload: string) => dispatch(setActiveBlockId(payload)),
    [dispatch],
  )

  const handleSetExpandedId = useCallback(
    (payload: string) => dispatch(setExpandedId(payload)),
    [dispatch],
  )

  const { type, selectedSelector, url, key, variant, element } = record

  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`
  const isRedirect = type === internalEventsMap[REDIRECT_STARTED]
  const isResize = type === resize
  const isInteractive =
    variant === INTERACTIVE_ELEMENT && !element?.validSelectors?.length

  const shouldHaveTopMargin =
    isRedirect ||
    isInteractive ||
    isResize ||
    !(record.shouldUseElementSelector ?? true)

  const isManualSelectorSetupVisible = record.type === ASSERTION

  const handleSelectElement = useCallback(() => {
    if (isSelectElement) {
      handleSetActiveBlockId('')
      disableSelectElement()
      setIsAddCustomSelector(false)
      setIsSelectElement(false)
    } else {
      handleSetActiveBlockId(record.id)
      enableSelectElement()
      setIsAddCustomSelector(false)
      setIsSelectElement(true)
    }
  }, [
    enableSelectElement,
    disableSelectElement,
    handleSetActiveBlockId,
    record,
    isSelectElement,
  ])

  const handleAddCustomSelector = useCallback(
    (e) => {
      handleSetActiveBlockId(record.id)
      dispatch(
        setCustomAssertSelector({
          selector: e.target.value,
          blockId: record.id,
        }),
      )
    },
    [handleSetActiveBlockId, record, dispatch],
  )

  const handleExpand = useCallback(() => {
    handleSetExpandedId(isExpanded ? '' : record.id)
  }, [handleSetExpandedId, isExpanded, record.id])

  const handleOnClickAddSelector = useCallback(() => {
    if (isAddCustomSelector) {
      setIsAddCustomSelector(false)
      setIsSelectElement(false)
    } else {
      handleSetExpandedId(record.id)
      setIsAddCustomSelector(true)
      setIsSelectElement(false)
    }
  }, [isAddCustomSelector, handleSetExpandedId, setIsAddCustomSelector, record])

  const interactiveElementLabel =
    record.shouldUseElementSelector ?? true
      ? (record as IEventBlock)?.element?.selectedSelector?.name
      : ''

  const interactiveElementSelectorValue =
    record.shouldUseElementSelector ?? true
      ? truncate(
          (record as IEventBlock)?.element?.selectedSelector?.value,
          13,
          isExpanded,
        )
      : ''

  useEffect(() => {
    setIsSelectElement(false)
  }, [lastSelectedEventId])

  return {
    shouldHaveTopMargin,
    isRedirect,
    isAddCustomSelector,
    isSelectElement,
    handleSelectElement,
    handleExpand,
    handleOnClickAddSelector,
    isManualSelectorSetupVisible,
    type,
    key,
    handleAddCustomSelector,
    interactiveElementLabel,
    interactiveElementSelectorValue,
    url,
    selector,
    isResize,
  }
}
