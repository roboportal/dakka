import { css } from '@emotion/react'

export const Label = ({ label, value }: { label: string; value: string }) => {
  if (!value) {
    return null
  }
  return (
    <>
      <div
        css={css`
          color: #b0bec5;
        `}
      >
        {label}
      </div>
      <div>{value}</div>
    </>
  )
}
