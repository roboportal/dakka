import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { grey } from '@mui/material/colors'

interface IActionsProps {
  isInteractive: boolean
  onSelectWaitForElement: () => void
  activeBlockId: string | null
  recordId: string
  isExpanded: boolean
  onExpand: () => void
}

export function Actions({
  isInteractive,
  onSelectWaitForElement,
  activeBlockId,
  recordId,
  isExpanded,
  onExpand,
}: IActionsProps) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid #196194;
      `}
    >
      {isInteractive && (
        <Tooltip title="Locate Element">
          <IconButton
            css={css`
              padding: 0;
              color: ${activeBlockId === recordId ? grey[300] : grey[500]};
              font-size: 12px;
              &.MuiIconButton-root:hover {
                background: transparent;
              }
            `}
            onClick={onSelectWaitForElement}
            size="small"
          >
            <LocationSearchingIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Expand Event">
        <Button
          onClick={onExpand}
          css={css`
            margin-left: auto;
            border-radius: 0px;
            color: ${grey[500]};
            padding: 0px;
            min-width: 0;
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
                color: ${grey[500]};
              `}
              fontSize="small"
            />
          ) : (
            <OpenInFullIcon
              css={css`
                pointer-events: none;
                color: ${grey[500]};
              `}
              fontSize="small"
            />
          )}
        </Button>
      </Tooltip>
    </div>
  )
}
