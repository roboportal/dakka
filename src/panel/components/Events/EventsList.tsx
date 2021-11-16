import { Fragment, memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload } from '../../redux/eventRecorderSlice'
import { REDIRECT_STARTED } from '../../../constants/messageTypes'

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
        word-wrap: break-word;
        width: ${type === REDIRECT_STARTED ? '120px' : '88px'};
        border: 1px solid #eee;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 4px;
        background-color: ${type === REDIRECT_STARTED ? '#316e9f' : '#673ab7'};
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

function EventsList({ events }: IEventsListProps) {
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
            <Fragment key={records[0].id}>
              <div
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
                  {records[0].triggeredAt}
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
            </Fragment>
          )
        } else {
          const delta = record.deltaTime
          return (
            <Fragment key={record.id}>
              <div
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
                  {record.triggeredAt}
                </div>
                <EventEntity record={record} index={index.toString()} />
              </div>
            </Fragment>
          )
        }
      })}
    </>
  )
}

export default memo(EventsList)
