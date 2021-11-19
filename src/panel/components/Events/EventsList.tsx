import { Fragment, memo } from 'react'
import { css } from '@emotion/react'
import { lightBlue, indigo } from '@mui/material/colors'

import { IEventPayload, ISelectorPayload } from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'

interface IEventsListProps {
  events: IEventPayload[]
  handleSelectSelector: (payload: ISelectorPayload) => void
}

function EventsList({ events, handleSelectSelector }: IEventsListProps) {
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
                  <span
                    css={css`
                      display: block;
                    `}
                  >
                    {records[0].triggeredAt}
                  </span>
                  <Selector
                    record={records[0]}
                    handleSelectSelector={handleSelectSelector}
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
                  <span
                    css={css`
                      display: block;
                    `}
                  >
                    {record.triggeredAt}
                  </span>
                  <Selector
                    record={record}
                    handleSelectSelector={handleSelectSelector}
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
