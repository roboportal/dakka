import { memo, useState } from 'react'
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
}

function EventsList({
  events,
  onSelectSelector,
  onInsertBlock,
}: IEventsListProps) {
  const [dragOverIndex, setDragOverIndex] = useState(-2)

  if (!events) {
    return null
  }

  return (
    <>
      {events?.map((record, index) => {
        if (Array.isArray(record)) {
          const records = record as IEventPayload[]
          const delta = records[0].deltaTime

          return (
            <Record
              key={records[0].id}
              onInsertBlock={onInsertBlock}
              setDragOverIndex={setDragOverIndex}
              dragOverIndex={dragOverIndex}
              events={events}
              record={records[0]}
              currentIndex={index}
            >
              <div
                css={css`
                  text-align: center;
                  flex-direction: column;
                  display: flex;
                `}
              >
                <div
                  css={css`
                    text-align: center;
                  `}
                >
                  <div>{records[0].triggeredAt}</div>
                  <Selector
                    record={records[0]}
                    onSelectSelector={onSelectSelector}
                  />
                </div>
                {records.map((record, _index) => {
                  return (
                    <EventEntity
                      key={record.id}
                      record={record}
                      index={`${index}.${_index}`}
                    />
                  )
                })}
              </div>
            </Record>
          )
        } else {
          const delta = record.deltaTime

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
                <div>{record.triggeredAt}</div>
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
        }
      })}
    </>
  )
}

export default memo(EventsList)
