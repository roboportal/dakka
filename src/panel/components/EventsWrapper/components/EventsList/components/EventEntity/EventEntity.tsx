import { useCallback, useEffect, useState } from 'react'
import { css } from '@emotion/react'
import { lightBlue, indigo } from '@mui/material/colors'

import { internalEventsMap } from 'constants/internalEventsMap'
import {
  IEventPayload,
  IEventBlock,
  IAssertionPayload,
} from 'store/eventRecorderSlice'
import { REDIRECT_STARTED, INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { AssertionSelector } from './components/AssertionSelector'
import { EntryRow } from './components/EntryRow'
import { Actions } from './components/Actions'
import { DeleteAction } from './components/DeleteAction'
import { truncate } from './helper'

function getBackgroundColor({
  isHover,
  isRedirect,
  prefersDarkMode,
}: {
  isRedirect: boolean
  prefersDarkMode: boolean
  isHover?: boolean
}) {
  if (!prefersDarkMode && isHover && !isRedirect) {
    return 'black'
  }

  if (prefersDarkMode) {
    return isRedirect ? indigo[900] : lightBlue[900]
  }

  return isRedirect ? 'rgb(26, 32, 39)' : 'rgb(0, 30, 60)'
}

export function EventEntity({
  record,
  index,
  enableSelectElement,
  disableSelectElement,
  onSetActiveBlockId,
  onExpand,
  isExpanded,
  onSetAssertProperties,
  prefersDarkMode,
  isFirstEntity,
  onSetCustomAssertSelector,
  lastSelectedEventId,
}: {
  record: IEventPayload | IEventBlock
  index: string
  enableSelectElement: () => void
  disableSelectElement: () => void
  onSetActiveBlockId: (id: string) => void
  onExpand: (id: string) => void
  isExpanded: boolean
  lastSelectedEventId: string
  onSetAssertProperties: (payload: IAssertionPayload) => void
  prefersDarkMode: boolean
  isFirstEntity: boolean
  onSetCustomAssertSelector: (payload: {
    selector: string
    blockId: string
  }) => void
}) {
  const { type, selectedSelector, url, key, variant } = record as IEventPayload
  const { element } = record as IEventBlock
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`
  const isRedirect = type === internalEventsMap[REDIRECT_STARTED]
  const isInteractive =
    variant === INTERACTIVE_ELEMENT && !element?.validSelectors?.length
  const [isAddCustomSelector, setIsAddCustomSelector] = useState(false)
  const [isSelectElement, setIsSelectElement] = useState(false)

  const handleSelectElement = useCallback(() => {
    if (isSelectElement) {
      onSetActiveBlockId('')
      disableSelectElement()
      setIsAddCustomSelector(false)
      setIsSelectElement(false)
    } else {
      onSetActiveBlockId(record.id)
      enableSelectElement()
      setIsAddCustomSelector(false)
      setIsSelectElement(true)
    }
  }, [
    enableSelectElement,
    disableSelectElement,
    onSetActiveBlockId,
    record,
    isSelectElement,
  ])

  const handleAddCustomSelector = useCallback(
    (e) => {
      onSetActiveBlockId(record.id)
      onSetCustomAssertSelector({
        selector: e.target.value,
        blockId: record.id,
      })
    },
    [onSetActiveBlockId, record, onSetCustomAssertSelector],
  )

  const handleExpand = useCallback(() => {
    onExpand(isExpanded ? '' : record.id)
  }, [onExpand, isExpanded, record.id])

  const handleOnClickAddSelector = useCallback(() => {
    if (isAddCustomSelector) {
      setIsAddCustomSelector(false)
      setIsSelectElement(false)
    } else {
      onExpand(record.id)
      setIsAddCustomSelector(true)
      setIsSelectElement(false)
    }
  }, [isAddCustomSelector, onExpand, setIsAddCustomSelector, record])

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

  const shouldHaveTopMargin =
    isRedirect || isInteractive || !(record.shouldUseElementSelector ?? true)

  const isManualSelectorSetupVisible = record.type === 'Assertion'

  return (
    <div
      data-event_list_index={index}
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        padding: 4px 4px 0px 4px;
        font-size: 0.8rem;
        margin-bottom: 4px;
        border: 1px solid;
        ${shouldHaveTopMargin ? 'margin-top: 28px;' : ''}
        background-color: ${getBackgroundColor({
          isRedirect,
          prefersDarkMode,
        })};
        :hover {
          background-color: ${getBackgroundColor({
            isRedirect,
            prefersDarkMode,
            isHover: true,
          })};
        }
      `}
    >
      <Actions
        isAddCustomSelector={isAddCustomSelector}
        isSelectElement={isSelectElement}
        prefersDarkMode={prefersDarkMode}
        isExpanded={isExpanded}
        isInteractive={record.variant === INTERACTIVE_ELEMENT}
        onSelectElement={handleSelectElement}
        onExpand={handleExpand}
        onAddCustomSelector={handleOnClickAddSelector}
        isIncompleteSetup={record.isInvalidValidSetUp ?? false}
        areElementsSelectorsVisible={record?.shouldUseElementSelector ?? true}
        isManualSelectorSetupVisible={isManualSelectorSetupVisible}
      />

      <div
        css={css`
          pointer-events: ${isExpanded ? 'auto' : 'none'};
          display: grid;
          flex-grow: 1;
          overflow: scroll;
          height: calc(100vh - 52px - 68px);
        `}
      >
        <EntryRow
          label="Event"
          value={type}
          prefersDarkMode={prefersDarkMode}
        />
        {key && (
          <EntryRow
            prefersDarkMode={prefersDarkMode}
            isExpanded={isExpanded}
            label="Key"
            value={truncate(key, 7, isExpanded)}
          />
        )}

        {record.variant === INTERACTIVE_ELEMENT ? (
          <EntryRow
            record={record as IEventBlock}
            isAddCustomSelector={isAddCustomSelector}
            onAddCustomSelector={handleAddCustomSelector}
            prefersDarkMode={prefersDarkMode}
            isLast={true}
            isExpanded={isExpanded}
            label={interactiveElementLabel}
            value={interactiveElementSelectorValue}
          />
        ) : (
          <EntryRow
            prefersDarkMode={prefersDarkMode}
            isLast={true}
            isDividerVisible={!isFirstEntity}
            isExpanded={isExpanded}
            label={isRedirect ? 'URL' : 'Selector'}
            value={
              isRedirect
                ? truncate(url, 9, isExpanded)
                : truncate(selector, 9, isExpanded)
            }
          />
        )}
        {record.type === 'Assertion' && (
          <AssertionSelector
            isExpanded={isExpanded}
            record={record as IEventBlock}
            onSetAssertProperties={onSetAssertProperties}
            prefersDarkMode={prefersDarkMode}
          />
        )}
      </div>
      {!isFirstEntity && <DeleteAction index={index} />}
    </div>
  )
}
