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
  disableSelectElement: () => void
  onSetActiveBlockId: (id: string) => void
  onSetExpandedId: (id: string) => void
  onSetAssertProperties: (payload: IAssertionPayload) => void
  prefersDarkMode: boolean
  lastSelectedEventId: string
  onSetCustomAssertSelector: (payload: {
    selector: string
    blockId: string
  }) => void
}

function EventsList({
  events,
  onSelectSelector,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  enableSelectElement,
  disableSelectElement,
  onSetActiveBlockId,
  onSetExpandedId,
  onSetAssertProperties,
  prefersDarkMode,
  onSetCustomAssertSelector,
  lastSelectedEventId,
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
        const isFirstEvent = index === 0
        return (
          <Record
            onInsertBlock={onInsertBlock}
            key={record.id}
            setDragOverIndex={setDragOverIndex}
            dragOverIndex={dragOverIndex}
            events={events}
            record={record}
            currentIndex={index}
            isFirstRecord={isFirstEvent}
          >
            <div
              css={css`
                text-align: center;
                min-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                max-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                display: flex;
                flex-direction: column;
                height: 100%;
              `}
            >
              <Selector
                width={expandedId === record.id ? '100%' : DEFAULT_WIDTH}
                record={record as IEventPayload}
                onSelectSelector={onSelectSelector}
              />
              <EventEntity
                onSetCustomAssertSelector={onSetCustomAssertSelector}
                onSetAssertProperties={onSetAssertProperties}
                prefersDarkMode={prefersDarkMode}
                isExpanded={expandedId === record.id}
                onExpand={handleExpand}
                onSetActiveBlockId={onSetActiveBlockId}
                enableSelectElement={enableSelectElement}
                disableSelectElement={disableSelectElement}
                record={record as IEventPayload}
                index={index.toString()}
                isFirstEntity={isFirstEvent}
                lastSelectedEventId={lastSelectedEventId}
              />
            </div>
          </Record>
        )
      })}
    </>
  )
}

export default memo(EventsList)
