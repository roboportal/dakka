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

function getCurrentTarget(e: any) {
  if (e.toElement) {
    return e.toElement
  }

  if (e.currentTarget) {
    return e.currentTarget
  }

  if (e.srcElement) {
    return e.srcElement
  }

  return null
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
    const element = getCurrentTarget(event)
    if (element) {
      element.style.cursor = 'grabbing'
      element.style.boxShadow = 'none'
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = effect
      event.dataTransfer.setData('source', id)
      onDragStart?.(event)
    }
  }

  const dragOver = (event: DragEvent) => {
    onDragOver?.(event)
  }

  const dragEnd = (event: DragEvent) => {
    const element = getCurrentTarget(event)
    element.style.cursor = 'grab'
    onDragEnd?.()
  }

  useEffect(() => {
    const element = (ref as MutableRefObject<HTMLElement>)?.current

    if (!element) {
      return
    }

    element.setAttribute('draggable', 'true')
    element.style.cursor = 'grab'
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
