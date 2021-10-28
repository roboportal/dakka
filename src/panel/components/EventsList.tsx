import { memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload } from '../redux/eventRecorderSlice'

interface IEventsListProps {
  events: IEventPayload[]
}

function EventEntity({
  record,
  index,
}: {
  record: IEventPayload
  index: string
}) {
  const { selector, type } = record
  return (
    <div
      data-event_list_index={index}
      css={css`
        border: 1px solid #eee;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 4px;
        background-color: #673ab7;
        :hover {
          background-color: #9575cd;
        }
        height: 100%;
      `}
    >
      <div
        css={css`
          pointer-events: none;
          margin-bottom: 8px;
        `}
      >
        {type}
      </div>
      <div
        css={css`
          pointer-events: none;
        `}
      >
        {selector}
      </div>
    </div>
  )
}

function Break({ delta }: { delta: number }) {
  if (!delta || delta < 100) {
    return null
  }
  return (
    <div
      css={css`
        height: 100%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          width: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {delta}
      </div>
    </div>
  )
}

function EventsList({ events }: IEventsListProps) {
  if (!events) {
    return null
  }
  return (
    <>
      {events?.map((record, index) => {
        if (Array.isArray(record)) {
          const records = record as IEventPayload[]
          const delta = records[0].deltaTime > 100 ? 0 : records[0].deltaTime
          return (
            <>
              <Break key={records[0].id + '_'} delta={records[0].deltaTime} />
              <div
                key={records[0].id}
                css={css`
                  display: flex;
                  flex-direction: column;
                  margin-left: ${delta + 2}px;
                `}
              >
                <div
                  css={css`
                    text-align: center;
                  `}
                >
                  {records[0].triggeredAt}
                </div>
                {records.map((record, _index) => (
                  <EventEntity
                    key={record.id}
                    record={record}
                    index={`${index}.${_index}`}
                  />
                ))}
              </div>
            </>
          )
        } else {
          const delta = record.deltaTime > 100 ? 0 : record.deltaTime
          return (
            <>
              <Break key={record.id + '_'} delta={record.deltaTime} />
              <div
                key={record.id}
                css={css`
                  display: flex;
                  flex-direction: column;
                  margin-left: ${delta + 2}px;
                `}
              >
                <div
                  css={css`
                    text-align: center;
                  `}
                >
                  {record.triggeredAt}
                </div>
                <EventEntity record={record} index={index.toString()} />
              </div>
            </>
          )
        }
      })}
    </>
  )
}

export default memo(EventsList)
