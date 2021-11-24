import { useRef } from 'react'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { useDrag } from '../../hooks/dnd/useDrag'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'

export const SpeedAction = ({ action, isOpen }: any) => {
  const ref = useRef<any>()
  useDrag({
    effect: 'copy',
    ref,
    id: action.name,
    onDragStart: () => {},
    onDragOver: () => {},
    onDragEnd: () => {},
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
