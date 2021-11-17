import { Fragment, memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload } from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selectors } from './Selectors'

interface IEventsListProps {
  events: IEventPayload[]
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
                  <Selectors record={records[0]} />
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
                    width: 88px;
                  `}
                >
                  <span>{record.triggeredAt}</span>
                  <Selectors record={record} />
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
