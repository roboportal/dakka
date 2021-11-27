import { useEffect, Ref, MutableRefObject } from 'react'

interface DragProps {
  ref: Ref<HTMLElement>
  effect:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
  id: string
  onDragStart?: (event: DragEvent) => void
  onDragOver?: (event: DragEvent) => void
  onDragEnd?: () => void
}

export const useDrag = ({
  ref,
  effect,
  id,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DragProps) => {
  const dragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = effect
      event.dataTransfer.setData('source', id)
      onDragStart?.(event)
    }
  }

  const dragOver = (event: DragEvent) => {
    onDragOver?.(event)
  }

  const dragEnd = () => {
    console.log('dragEnd')
    onDragEnd?.()
  }

  useEffect(() => {
    const element = (ref as MutableRefObject<HTMLElement>)?.current

    if (!element) {
      return
    }

    element.setAttribute('draggable', 'true')
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
