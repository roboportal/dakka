import { css } from '@emotion/react'

import { GAP_BETWEEN_RECORDS } from '../constants/defaults'

interface IDropZone {
  isOver?: boolean
  gap?: number
  className?: string
}

export function DropZone({
  isOver,
  gap = GAP_BETWEEN_RECORDS,
  className = '',
}: IDropZone) {
  return (
    <div
      className={className}
      css={css`
        background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
        min-width: ${gap}px;
        opacity: ${isOver ? '0.2' : '1'};
        border-radius: ${isOver ? '10px' : '0px'};
      `}
    />
  )
}
