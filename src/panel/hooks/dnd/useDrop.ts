import { useEffect, useState } from 'react'

interface DropProps {
  ref: any
  onDrop: any
}

export const useDrop = ({ ref, onDrop }: DropProps) => {
  const [dropState, setDropState] = useState('droppable')

  const dropOver = (event: any) => {
    event.preventDefault()
    setDropState('dropping over')
  }

  const drop = (event: any) => {
    console.log('drop', event.dataTransfer)
    onDrop(event.dataTransfer.getData('source'))
    setDropState('dropped')
  }

  useEffect(() => {
    const element = ref?.current

    if (!element) {
      return
    }
    console.log('element', element)
    element.addEventListener('dragover', dropOver)
    element.addEventListener('drop', drop)

    return () => {
      element.removeEventListener('dragover', dropOver)
      element.removeEventListener('drop', drop)
    }
  }, [ref, ref?.current])

  return { dropState }
}
