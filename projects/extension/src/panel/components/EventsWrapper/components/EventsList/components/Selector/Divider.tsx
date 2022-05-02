import { grey } from '@mui/material/colors'
import { css } from '@emotion/react'

export const Divider = () => {
  return (
    <div
      css={css`
        height: 0.5px;
        width: 100%;
        background-color: ${grey[600]};
      `}
    />
  )
}
