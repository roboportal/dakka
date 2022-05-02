import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { grey, red, green } from '@mui/material/colors'

interface IActionsProps {
  isInteractive: boolean
  onSelectElement: () => void
  isExpanded: boolean
  onExpand: () => void
  prefersDarkMode: boolean
  onAddCustomSelector: () => void
  isAddCustomSelector: boolean
  isSelectElement: boolean
  isIncompleteSetup: boolean
  areElementsSelectorsVisible: boolean
  isManualSelectorSetupVisible: boolean
}

export function Actions({
  isInteractive,
  onSelectElement,
  isExpanded,
  onExpand,
  prefersDarkMode,
  onAddCustomSelector,
  isAddCustomSelector,
  isSelectElement,
  isIncompleteSetup,
  areElementsSelectorsVisible,
  isManualSelectorSetupVisible,
}: IActionsProps) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
      `}
    >
      {isInteractive && areElementsSelectorsVisible && (
        <>
          <Tooltip title="Locate Element">
            <IconButton
              css={css`
                padding: 0;
                color: ${isSelectElement ? green.A400 : grey[500]};
                font-size: 12px;
                &.MuiIconButton-root:hover {
                  background: transparent;
                }
              `}
              onClick={onSelectElement}
              size="small"
            >
              <LocationSearchingIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {isManualSelectorSetupVisible && (
            <Tooltip title="Selector Override">
              <IconButton
                css={css`
                  padding: 0;
                  margin-left: 4px;
                  color: ${isAddCustomSelector ? green.A400 : grey[500]};
                  font-size: 12px;
                  &.MuiIconButton-root:hover {
                    background: transparent;
                  }
                `}
                onClick={onAddCustomSelector}
                size="small"
              >
                <AddCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}

      {isIncompleteSetup && (
        <Tooltip title="Unfinished Setup">
          <WarningAmberIcon
            fontSize="small"
            css={css`
              color: ${red.A200};
            `}
          />
        </Tooltip>
      )}

      <Tooltip title="Expand Event">
        <Button
          onClick={onExpand}
          css={css`
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
