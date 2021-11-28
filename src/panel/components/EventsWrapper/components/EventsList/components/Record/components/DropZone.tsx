import { css } from '@emotion/react'

import { DEFAULT_DELTA_TIME } from '../constants/defaults'

interface IDropZone {
  isOver?: boolean
  deltaTime?: number
  className?: string
}

export function DropZone({
  isOver,
  deltaTime = DEFAULT_DELTA_TIME,
  className = '',
}: IDropZone) {
  return (
    <div
      className={className}
      css={css`
        background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
        width: ${deltaTime}px;
        opacity: ${isOver ? '0.2' : '1'};
        border-radius: ${isOver ? '10px' : '0px'};
      `}
    />
  )
}
