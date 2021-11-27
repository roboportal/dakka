import { memo, useState } from 'react'
import { css } from '@emotion/react'

import {
  IEventPayload,
  ISelectorPayload,
  IEventBlock,
} from '../../redux/eventRecorderSlice'
import { Record } from './Record'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'

interface IEventsListProps {
  events: (IEventPayload | IEventPayload[] | IEventBlock)[]
  onSelectSelector: (payload: ISelectorPayload) => void
  onInsertBlock: (payload: any) => void
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
              triggeredAt={records[0].triggeredAt}
              index={index}
              key={records[0].id}
              delta={delta}
              onInsertBlock={onInsertBlock}
              setDragOverIndex={setDragOverIndex}
              dragOverIndex={dragOverIndex}
              events={events}
              record={record}
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
              triggeredAt={record.triggeredAt}
              index={index}
              onInsertBlock={onInsertBlock}
              key={record.id}
              delta={delta}
              setDragOverIndex={setDragOverIndex}
              dragOverIndex={dragOverIndex}
              events={events}
              record={record}
            >
              <div
                css={css`
                  text-align: center;
                  width: 88px;
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
