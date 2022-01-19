import { css } from '@emotion/react'

interface IEventEntityProps {
  label?: string
  value?: string
  isExpanded?: boolean
  isLast?: boolean
  prefersDarkMode: boolean
}

export function EntryRow({
  label,
  value,
  isExpanded,
  isLast,
  prefersDarkMode,
}: IEventEntityProps) {
  if (!label && !value) {
    return null
  }

  return (
    <div
      css={css`
        border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
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
