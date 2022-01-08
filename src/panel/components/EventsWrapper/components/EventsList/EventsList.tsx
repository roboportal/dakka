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
  activeBlockId,
}: IEventsListProps) {
  const [expandedId, setExpandedId] = useState('')

  const handleExpand = useCallback((id) => setExpandedId(id), [setExpandedId])

  if (!events) {
    return null
  }

  return (
    <>
      {events?.map((record, index) => {
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
                min-width: ${expandedId === record.id ? '340px' : '88px'};
                max-width: ${expandedId === record.id ? '340px' : '88px'};
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
