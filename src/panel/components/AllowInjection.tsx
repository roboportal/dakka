import { css } from '@emotion/react'
import Button from '@mui/material/Button'

interface AllowInjectionProps {
  allowInjection: () => void
}

export default function AllowInjection({
  allowInjection,
}: AllowInjectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
      `}
    >
      <h2
        css={css`
          width: 80vw;
          text-align: center;
          margin-bottom: 20vh;
        `}
      >
        We are not embedding a script into the page to record user actions by
        default to prevent possible performance or security concerns. Do you
        want to embed it for the current session?
      </h2>

      <Button variant="outlined" size="large" onClick={allowInjection}>
        Enable
      </Button>
    </div>
  )
}
