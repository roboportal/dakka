import { css } from '@emotion/react'

import { lightBlue, indigo } from '@mui/material/colors'

import { IEventPayload } from '../../redux/eventRecorderSlice'
import { REDIRECT_STARTED } from '../../../constants/messageTypes'

export function EventEntity({
  record,
  index,
}: {
  record: IEventPayload
  index: string
}) {
  const { type, selectedSelector, url } = record

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
        background-color: ${type === REDIRECT_STARTED
          ? indigo[900]
          : lightBlue[900]};
        :hover {
          background-color: ${lightBlue[700]};
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
        {type === REDIRECT_STARTED ? (
          <span>{url}</span>
        ) : (
          <span>
            {selectedSelector?.name}: {selectedSelector?.value}
          </span>
        )}
      </div>
    </div>
  )
}
