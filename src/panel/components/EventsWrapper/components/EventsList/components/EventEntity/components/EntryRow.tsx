import { css } from '@emotion/react'

interface IEventEntityProps {
  label?: string
  value?: string
  isExpanded?: boolean
  isLast?: boolean
}

export function EntryRow({
  label,
  value,
  isExpanded,
  isLast,
}: IEventEntityProps) {
  if (!label && !value) {
    return null
  }

  return (
    <div
      css={css`
        border-bottom: 1px solid #196194;
        text-align: start;
        pointer-events: ${isExpanded ? 'auto' : 'none'};
        margin-bottom: ${isLast ? '0px' : '8px'};
        word-wrap: break-word;
      `}
    >
      <div
        css={css`
          color: #b0bec5;
        `}
      >
        {label}
      </div>
      <div
        css={css`
          color: #eceff1;
          margin-bottom: 4px;
        `}
      >
        {value}
      </div>
    </div>
  )
}
