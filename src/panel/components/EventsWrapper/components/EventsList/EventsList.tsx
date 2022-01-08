import { memo, useCallback, useState } from 'react'
import { css } from '@emotion/react'

import {
  EventListItem,
  IEventPayload,
  ISelectorPayload,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import { Record } from './components/Record/Record'
import { EventEntity } from './components/EventEntity/EventEntity'
import { Selector } from './components/Selector'

interface IEventsListProps {
  events: EventListItem[]
  onSelectSelector: (payload: ISelectorPayload) => void
  onInsertBlock: (payload: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  enableSelectElement: () => void
  handleSetActiveBlockId: (id: string) => void
  handleSetExpandedId: (id: string) => void
  expandedId: string | null
  activeBlockId: string | null
}

function EventsList({
  events,
  onSelectSelector,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  enableSelectElement,
  handleSetActiveBlockId,
  handleSetExpandedId,
  expandedId,
  activeBlockId,
}: IEventsListProps) {
  const handleExpand = useCallback(
    (id) => handleSetExpandedId(id),
    [handleSetExpandedId],
  )

  if (!events) {
    return null
  }

  return (
    <>
      {events?.map((record, index) => {
        const recordWidth = expandedId === record.id ? '340px' : '88px'

        return (
          <Record
            onInsertBlock={onInsertBlock}
            key={record.id}
            setDragOverIndex={setDragOverIndex}
            dragOverIndex={dragOverIndex}
            events={events}
            record={record}
            currentIndex={index}
          >
            <div
              css={css`
                text-align: center;
                min-width: ${recordWidth};
                max-width: ${recordWidth};
                display: flex;
                flex-direction: column;
                min-height: 224px;
              `}
            >
              <Selector
                width={expandedId === record.id ? '100%' : '88px'}
                record={record as IEventPayload}
                onSelectSelector={onSelectSelector}
              />
              <EventEntity
                isExpanded={expandedId === record.id}
                onExpand={handleExpand}
                handleSetActiveBlockId={handleSetActiveBlockId}
                enableSelectElement={enableSelectElement}
                record={record as IEventPayload}
                index={index.toString()}
                activeBlockId={activeBlockId}
              />
            </div>
          </Record>
        )
      })}
    </>
  )
}

export default memo(EventsList)
