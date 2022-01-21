import { useCallback } from 'react'
import { css } from '@emotion/react'
import { lightBlue, indigo } from '@mui/material/colors'

import { internalEventsMap } from 'constants/internalEventsMap'
import {
  IEventPayload,
  IEventBlock,
  IAssetionPaylod,
} from 'store/eventRecorderSlice'
import { REDIRECT_STARTED, INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { AssertionSelector } from './components/AssertionSelector'
import { EntryRow } from './components/EntryRow'
import { Actions } from './components/Actions'
import { DeleteAction } from './components/DeleteAction'
import { truncate } from './helper'

export function EventEntity({
  record,
  index,
  enableSelectElement,
  handleSetActiveBlockId,
  activeBlockId,
  onExpand,
  isExpanded,
  onSetAssertProperties,
}: {
  record: IEventPayload | IEventBlock
  index: string
  enableSelectElement: () => void
  handleSetActiveBlockId: (id: string) => void
  activeBlockId: string | null
  onExpand: (id: string) => void
  isExpanded: boolean
  onSetAssertProperties: (payload: IAssetionPaylod) => void
}) {
  const { type, selectedSelector, url, key, variant } = record as IEventPayload
  const { element } = record as IEventBlock
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`
  const isRedirect = type === internalEventsMap[REDIRECT_STARTED]
  const isInteractive = variant === INTERACTIVE_ELEMENT && !element

  const handleSelectWaitForElement = useCallback(() => {
    handleSetActiveBlockId(record.id)
    enableSelectElement()
  }, [enableSelectElement, handleSetActiveBlockId, record])

  const handleExpand = useCallback(() => {
    onExpand(isExpanded ? '' : record.id)
  }, [onExpand, isExpanded, record.id])

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
        ${isRedirect || isInteractive ? 'margin-top: 28px;' : ''}
        background-color: ${isRedirect ? indigo[900] : lightBlue[900]};
        :hover {
          background-color: ${isRedirect ? indigo[900] : lightBlue[700]};
        }
      `}
    >
      <Actions
        isExpanded={isExpanded}
        isInteractive={record.variant === INTERACTIVE_ELEMENT}
        onSelectWaitForElement={handleSelectWaitForElement}
        activeBlockId={activeBlockId}
        recordId={record.id}
        onExpand={handleExpand}
      />

      <div
        css={css`
          pointer-events: ${isExpanded ? 'auto' : 'none'};
          display: grid;
          flex-grow: 1;
          overflow: scroll;
        `}
      >
        <EntryRow label="Event" value={type} />
        {key && (
          <EntryRow
            isExpanded={isExpanded}
            label="Key"
            value={truncate(key, 7, isExpanded)}
          />
        )}

        {record.variant === INTERACTIVE_ELEMENT ? (
          <EntryRow
            isLast={true}
            isExpanded={isExpanded}
            label={(record as IEventBlock)?.element?.selectedSelector?.name}
            value={truncate(
              (record as IEventBlock)?.element?.selectedSelector?.value,
              13,
              isExpanded,
            )}
          />
        ) : (
          <EntryRow
            isLast={true}
            isExpanded={isExpanded}
            label={isRedirect ? 'URL' : 'Selector'}
            value={
              isRedirect
                ? truncate(url, 9, isExpanded)
                : truncate(selector, 9, isExpanded)
            }
          />
        )}
        {record.type === 'Assertion' && !!element && (
          <AssertionSelector
            isExpanded={isExpanded}
            record={record as IEventBlock}
            onSetAssertProperties={onSetAssertProperties}
          />
        )}
      </div>
      <DeleteAction index={index} />
    </div>
  )
}
