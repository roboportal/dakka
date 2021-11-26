import { useEffect, Ref, MutableRefObject } from 'react'

interface DropProps {
  ref: Ref<HTMLElement>
  onDrop: any
  onDropOver: any
}

export const useDrop = ({ ref, onDrop, onDropOver }: DropProps) => {
  const dropOver = (event: DragEvent) => {
    event.preventDefault()
    onDropOver(event)
  }

  const drop = (event: DragEvent) => {
    if (event.dataTransfer) {
      onDrop(event.dataTransfer.getData('source'))
    }
  }

  useEffect(() => {
    const element = (ref as MutableRefObject<HTMLElement>)?.current

    if (!element) {
      return
    }

    element.addEventListener('dragover', dropOver)
    element.addEventListener('drop', drop)

    return () => {
      element.removeEventListener('dragover', dropOver)
      element.removeEventListener('drop', drop)
    }
  }, [onDrop, onDropOver])

  return null
}
