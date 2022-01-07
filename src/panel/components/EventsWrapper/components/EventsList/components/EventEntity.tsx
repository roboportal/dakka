import { useCallback } from 'react'
import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import { lightBlue, indigo, grey } from '@mui/material/colors'

import { IEventPayload, IEventBlock } from 'store/eventRecorderSlice'
import { REDIRECT_STARTED, INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { internalEventsMap } from 'constants/internalEventsMap'

export function EventEntity({
  record,
  index,
  enableSelectElement,
  handleSetActiveBlockId,
  activeBlockId,
}: {
  record: IEventPayload | IEventBlock
  index: string
  enableSelectElement: () => void
  handleSetActiveBlockId: (id: string) => void
  activeBlockId: string | null
}) {
  const { type, selectedSelector, url, key } = record as IEventPayload
  const isRedirect = type === internalEventsMap[REDIRECT_STARTED]
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`

  const handleSelectWaitForElement = useCallback(() => {
    handleSetActiveBlockId(record.id)
    enableSelectElement()
  }, [enableSelectElement, handleSetActiveBlockId, record])

  return (
    <div
      data-event_list_index={index}
      css={css`
        height: 100%;
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
      `}
    >
      <div
        css={css`
          pointer-events: none;
        `}
      >
        <div
          css={css`
            margin-bottom: 8px;
          `}
        >
          {type} {key}
        </div>

        {record.variant === INTERACTIVE_ELEMENT ? (
          <span>
            {(record as IEventBlock)?.element?.selectedSelector?.name}{' '}
            {(record as IEventBlock)?.element?.selectedSelector?.value}
          </span>
        ) : (
          <div
            css={css`
              pointer-events: none;
            `}
          >
            {record.variant !== INTERACTIVE_ELEMENT && (
              <span>{isRedirect ? url : selector}</span>
            )}
          </div>
        )}
      </div>
      {record.variant === INTERACTIVE_ELEMENT && !activeBlockId && (
        <Button onClick={handleSelectWaitForElement}>Select Element</Button>
      )}
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
    </div>
  )
}
