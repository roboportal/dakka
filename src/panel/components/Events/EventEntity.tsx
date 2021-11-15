import { css } from '@emotion/react'

import { IEventPayload } from '../../redux/eventRecorderSlice'

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
        width: ${type === 'redirect' ? '120px' : '88px'};
        border: 1px solid #eee;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 4px;
        background-color: ${type === 'redirect' ? '#316e9f' : '#673ab7'};
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
        {type === 'redirect' ? (
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
