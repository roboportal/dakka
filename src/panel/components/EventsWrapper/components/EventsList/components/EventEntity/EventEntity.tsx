import { useCallback } from 'react'
import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { lightBlue, indigo, grey } from '@mui/material/colors'

import { IEventPayload, IEventBlock } from 'store/eventRecorderSlice'
import { REDIRECT_STARTED, INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { EntryRow } from './components/EntryRow'
import { truncate } from './helper'

export function EventEntity({
  record,
  index,
  enableSelectElement,
  handleSetActiveBlockId,
  activeBlockId,
  onExpand,
  isExpanded,
}: {
  record: IEventPayload | IEventBlock
  index: string
  enableSelectElement: () => void
  handleSetActiveBlockId: (id: string) => void
  activeBlockId: string | null
  onExpand: (id: string) => void
  isExpanded: boolean
}) {
  const { type, selectedSelector, url, key } = record as IEventPayload
  const isRedirect = type === REDIRECT_STARTED
  const selector = `${selectedSelector?.name}: ${selectedSelector?.value}`

  const handleSelectWaitForElement = useCallback(() => {
    handleSetActiveBlockId(record.id)
    enableSelectElement()
  }, [enableSelectElement, handleSetActiveBlockId, record])

  const handleExpand = useCallback(() => {
    onExpand(isExpanded ? '' : record.id)
  }, [onExpand, isExpanded, record.id])

  return (
    <div
      data-event_list_index={index}
      css={css`
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 4px;
        padding: 4px 4px 0px 4px;
        font-size: 0.8rem;
        margin-bottom: 4px;
        background-color: ${isRedirect ? indigo[900] : lightBlue[900]};
        :hover {
          background-color: ${isRedirect ? indigo[900] : lightBlue[700]};
        }
      `}
    >
      <Tooltip
        css={css`
          position: absolute;
          top: 0;
          right: 0;
          padding: 0;
        `}
        title="Expand Event"
      >
        <Button
          onClick={handleExpand}
          css={css`
            min-width: 25px;
            min-height: 25px;
            border-radius: 0px;
            color: #0a6ebf;

            :hover {
              .MuiSvgIcon-root {
                color: #eee;
              }
            }
            .MuiButtonBase-root:hover {
              background-color: 'transparent';
            }
          `}
        >
          {isExpanded ? (
            <CloseFullscreenIcon
              css={css`
                pointer-events: none;
                color: #0a6ebf;
              `}
              fontSize="small"
            />
          ) : (
            <OpenInFullIcon
              css={css`
                pointer-events: none;
                color: #0a6ebf;
              `}
              fontSize="small"
            />
          )}
        </Button>
      </Tooltip>
      {record.variant === INTERACTIVE_ELEMENT && (
        <Tooltip title="Locate Element">
          <IconButton
            css={css`
              max-width: 25px;
              padding: 0;
              color: ${activeBlockId === record.id ? grey[500] : grey[300]};
              font-size: 12px;
              &.MuiIconButton-root:hover {
                background: transparent;
              }
            `}
            onClick={handleSelectWaitForElement}
            size="small"
          >
            <LocationSearchingIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <div
        css={css`
          pointer-events: ${isExpanded ? 'auto' : 'none'};
        `}
      >
        <div
          css={css`
            margin-bottom: 8px;
          `}
        >
          <EntryRow label="Event" value={type} divider={3} />
          {key && (
            <EntryRow
              divider={3}
              isExpanded={isExpanded}
              label="Key"
              value={truncate(key, 7, isExpanded)}
            />
          )}
        </div>

        {record.variant === INTERACTIVE_ELEMENT ? (
          <EntryRow
            divider={4}
            isExpanded={isExpanded}
            label={(record as IEventBlock)?.element?.selectedSelector?.name}
            value={truncate(
              (record as IEventBlock)?.element?.selectedSelector?.value,
              13,
              isExpanded,
            )}
          />
        ) : (
          <EntryRow
            divider={isRedirect ? 1 : 4}
            isLast={true}
            isExpanded={isExpanded}
            label={isRedirect ? 'URL' : 'Selector'}
            value={
              isRedirect
                ? truncate(url, 9, isExpanded)
                : truncate(selector, 9, isExpanded)
            }
          />
        )}
      </div>

      <Tooltip title="Delete Event">
        <Button
          data-event_list_index={index}
          data-event_list_action="remove"
          css={css`
            min-width: 25px;
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
      </Tooltip>
    </div>
  )
}
