import { memo } from 'react'
import { css } from '@emotion/react'

import {
  EventListItem,
  IEventPayload,
  ISelectorPayload,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import { Record } from './components/Record/Record'
import { EventEntity } from './components/EventEntity'
import { Selector } from './components/Selector'

interface IEventsListProps {
  events: EventListItem[]
  onSelectSelector: (payload: ISelectorPayload) => void
  onInsertBlock: (payload: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
}

function EventsList({
  events,
  onSelectSelector,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
}: IEventsListProps) {
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
                width: 88px;
                display: flex;
                flex-direction: column;
              `}
            >
              <Selector
                record={record as IEventPayload}
                onSelectSelector={onSelectSelector}
              />
              <EventEntity
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
