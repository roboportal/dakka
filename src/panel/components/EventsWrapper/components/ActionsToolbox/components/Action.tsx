import { useRef } from 'react'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { useDrag } from '@/hooks/dnd/useDrag'

import actions from './actions'

type SpeedActionProps = {
  onDragEnd: () => void
  isOpen: boolean
  action: typeof actions[number]
}

export const SpeedAction = ({
  action,
  isOpen,
  onDragEnd,
}: SpeedActionProps) => {
  const ref = useRef<HTMLElement>(null)

  useDrag({
    effect: 'move',
    ref,
    id: action.name,
    onDragEnd: onDragEnd,
  })

  return (
    <SpeedDialAction
      ref={ref}
      draggable
      icon={action.icon}
      tooltipTitle={action.name}
      open={isOpen}
    />
  )
}
