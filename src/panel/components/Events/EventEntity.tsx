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
  const isRedirect = type === REDIRECT_STARTED
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`

  return (
    <div
      data-event_list_index={index}
      css={css`
        font-size: 12px;
        word-wrap: break-word;
        width: ${isRedirect ? '120px' : '88px'};
        border: 1px solid #eee;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 4px;
        background-color: ${isRedirect ? indigo[900] : lightBlue[900]};
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
        <span>{isRedirect ? url : selector}</span>
      </div>
    </div>
  )
}
