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
  const [dropState, setDropState] = useState('droppable')

  const dropOver = (event: any) => {
    event.preventDefault()
    setDropState('dropping over')
    onDropOver(event)
  }

  const dropLeave = (event: any) => {
    event.preventDefault()
    setDropState('drop leave')
    onDropLeave()
  }

  const drop = (event: any) => {
    onDrop(event.dataTransfer.getData('source'))
    setDropState('dropped')
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
      element.addEventListener('dragleave', dropLeave)
      element.removeEventListener('drop', drop)
    }
  }, [ref, ref?.current])

  return { dropState }
}
