import { useEffect, useState } from 'react'

interface DropProps {
  ref: any
  onDrop: any
  onDropOver: any
  onDropLeave?: any
}

export const useDrop = ({
  ref,
  onDrop,
  onDropOver,
  onDropLeave,
}: DropProps) => {
  const dropOver = (event: any) => {
    event.preventDefault()
    onDropOver(event)
  }

  const dropLeave = (event: any) => {
    event.preventDefault()
    onDropLeave()
  }

  const drop = (event: any) => {
    onDrop(event.dataTransfer.getData('source'))
  }

  useEffect(() => {
    const element = ref?.current

    if (!element) {
      return
    }

    element.addEventListener('dragover', dropOver)
    element.addEventListener('dragleave', dropLeave)
    element.addEventListener('drop', drop)

    return () => {
      element.removeEventListener('dragover', dropOver)
      element.removeEventListener('dragleave', dropLeave)
      element.removeEventListener('drop', drop)
    }
  }, [onDrop, onDropOver, onDropLeave])

  return null
}
