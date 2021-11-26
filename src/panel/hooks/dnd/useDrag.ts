import { useEffect, useState } from 'react'

interface DragProps {
  ref: any
  effect: any
  id: any
  onDragStart: any
  onDragOver: any
  onDragEnd: any
}

export const useDrag = ({
  ref,
  effect,
  id,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DragProps) => {
  const dragStart = (event: any) => {
    event.dataTransfer.effectAllowed = effect
    event.dataTransfer.setData('source', id)
    onDragStart?.()
  }

  const dragOver = () => {
    onDragOver?.()
  }

  const dragEnd = () => {
    onDragEnd?.()
  }

  useEffect(() => {
    const element = ref?.current

    if (!element) {
      return
    }

    element.setAttribute('draggable', true)
    element.addEventListener('dragstart', dragStart)
    element.addEventListener('dragover', dragOver)
    element.addEventListener('dragend', dragEnd)

    return () => {
      element.removeEventListener('dragstart', dragStart)
      element.removeEventListener('dragover', dragOver)
      element.removeEventListener('dragend', dragEnd)
    }
  }, [id, effect, onDragStart, onDragOver, onDragEnd])

  return null
}
