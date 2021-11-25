import { memo, useState } from 'react'
import { css } from '@emotion/react'

import {
  IEventPayload,
  ISelectorPayload,
  IEventBlock,
} from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'
import Record from './Record'

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
  const [dragOverIndex, setDragOverIndex] = useState(-1)

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
            <div
              key={records[0].id}
              css={css`
                display: flex;
                flex-direction: column;
                margin-left: ${delta}px;
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
          )
        } else {
          const delta = record.deltaTime

          return (
            <Record
              index={index.toString()}
              onInsertBlock={onInsertBlock}
              key={record.id}
              record={record}
              onSelectSelector={onSelectSelector}
              delta={delta}
              setDragOverIndex={setDragOverIndex}
              dragOverIndex={dragOverIndex}
            />
          )
        }
      })}
    </>
  )
}

export default memo(EventsList)
