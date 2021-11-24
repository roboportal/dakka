import { useCallback, useRef } from 'react'
import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import { lightBlue, indigo, grey } from '@mui/material/colors'

import { IEventPayload } from '../../redux/eventRecorderSlice'
import { REDIRECT_STARTED } from '../../../constants/messageTypes'
import { useDrop } from '../../hooks/dnd/useDrop'

export function EventEntity({
  record,
  index,
}: {
  record: IEventPayload
  index: string
}) {
  const ref = useRef<any>()
  const handleDrop = useCallback((e) => {
    console.log('handleDrop', e)
  }, [])
  useDrop({ ref, onDrop: handleDrop })
  const { type, selectedSelector, url } = record
  const isRedirect = type === REDIRECT_STARTED
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
      <div>
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
      <Button
        data-event_list_index={index}
        data-event_list_action="remove"
        css={css`
          color: ${grey[500]};

          :hover {
            .MuiSvgIcon-root {
              color: #eee;
            }
          }

          .MuiButtonBase-root:hover {
            background-color: 'transparent';
          }
        `}
        variant="text"
      >
        <DeleteIcon
          css={css`
            pointer-events: none;
            color: ${grey[500]};
          `}
          fontSize="small"
        />
      </Button>
      <div
        ref={ref}
        css={css`
          background-color: red;
          width: 40px;
        `}
      ></div>
    </div>
  )
}
