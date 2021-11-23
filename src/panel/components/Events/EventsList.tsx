import { Fragment, memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload, ISelectorPayload } from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'

interface IEventsListProps {
  events: IEventPayload[]
  onSelectSelector: (payload: ISelectorPayload) => void
}

function EventsList({ events, onSelectSelector }: IEventsListProps) {
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
                  <div>{record.triggeredAt}</div>
                  <Selector
                    record={record}
                    onSelectSelector={onSelectSelector}
                  />
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
