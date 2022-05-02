import { css } from '@emotion/react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import { grey } from '@mui/material/colors'

export function DeleteAction({ index }: { index: string }) {
  return (
    <Tooltip title="Delete Event">
      <Button
        data-event_list_index={index}
        data-event_list_action="remove"
        css={css`
          width: 100%;
          height: 30px;
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
  )
}
