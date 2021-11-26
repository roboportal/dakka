import { useCallback, useRef } from 'react'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { useDrag } from '../../hooks/dnd/useDrag'
import { actions } from './ActionsToolbox'

type SpeedActionProps = {
  onDragEnd: (value: boolean) => void
  isOpen: boolean
  action: typeof actions[number]
}

export const SpeedAction = ({
  action,
  isOpen,
  onDragEnd,
}: SpeedActionProps) => {
  const ref = useRef<React.Ref<unknown>>()

  const handleDragEnd = useCallback(() => {
    onDragEnd(false)
  }, [onDragEnd])

  useDrag({
    effect: 'all',
    ref,
    id: action.name,
    onDragStart: () => {},
    onDragOver: () => {},
    onDragEnd: handleDragEnd,
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
