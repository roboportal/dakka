import { memo, useCallback } from 'react'
import { css } from '@emotion/react'

import {
  EventListItem,
  IEventPayload,
  ISelectorPayload,
  IEventBlockPayload,
  IAssertionPayload,
} from 'store/eventRecorderSlice'
import { getExpandedEventId } from 'store/eventSelectors'

import { Record } from './components/Record/Record'
import { EventEntity } from './components/EventEntity/EventEntity'
import { Selector } from './components/Selector'
import { useSelector } from 'react-redux'

const DEFAULT_WIDTH = '88px'
const EXPANDED_WIDTH = '340px'

interface IEventsListProps {
  events: EventListItem[]
  onSelectSelector: (payload: ISelectorPayload) => void
  onInsertBlock: (payload: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  enableSelectElement: () => void
  onSetActiveBlockId: (id: string) => void
  onSetExpandedId: (id: string) => void
  onSetAssertProperties: (payload: IAssertionPayload) => void
  prefersDarkMode: boolean
}

function EventsList({
  events,
  onSelectSelector,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  enableSelectElement,
  onSetActiveBlockId,
  onSetExpandedId,
  onSetAssertProperties,
  prefersDarkMode,
}: IEventsListProps) {
  const expandedId = useSelector(getExpandedEventId)
  const handleExpand = useCallback(
    (id) => onSetExpandedId(id),
    [onSetExpandedId],
  )

  if (!events) {
    return null
  }

  return (
    <>
      {events?.map((record, index) => {
        const isExpanded = expandedId === record.id
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
                min-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                max-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                display: flex;
                flex-direction: column;
                min-height: 224px;
              `}
            >
              <Selector
                width={expandedId === record.id ? '100%' : DEFAULT_WIDTH}
                record={record as IEventPayload}
                onSelectSelector={onSelectSelector}
              />
              <EventEntity
                onSetAssertProperties={onSetAssertProperties}
                prefersDarkMode={prefersDarkMode}
                isExpanded={expandedId === record.id}
                onExpand={handleExpand}
                onSetActiveBlockId={onSetActiveBlockId}
                enableSelectElement={enableSelectElement}
                record={record as IEventPayload}
                index={index.toString()}
              />
            </div>
          </Record>
        )
      })}
    </>
  )
}

export default memo(EventsList)
