import { css } from '@emotion/react'

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import useToggle from '@/hooks/useToggle'

export default function ProjectPanel() {
  const [isDrawerOpened, toggleIsDrawerOpened] = useToggle(false)
  return (
    <>
      <Drawer
        anchor="left"
        open={isDrawerOpened}
        onClose={toggleIsDrawerOpened}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            width: 300px;
            margin: 8px;
          `}
        >
          <IconButton
            css={css`
              align-self: flex-end;
            `}
            color="primary"
            onClick={toggleIsDrawerOpened}
          >
            <CloseIcon />
          </IconButton>
          <div>items</div>
        </div>
      </Drawer>
      <IconButton
        css={css`
          border-radius: 4px;
          margin: 0 4px 8px 0;
          padding: 0 4px;
        `}
        color="info"
        onClick={toggleIsDrawerOpened}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </>
  )
}
