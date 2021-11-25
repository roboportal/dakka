import { useRef, useCallback } from 'react'
import { css } from '@emotion/react'

import { IEventPayload, IEventBlock } from '../../redux/eventRecorderSlice'
import { useDrop } from '../../hooks/dnd/useDrop'

const RECORD_WIDTH = 88

interface IRecordProps {
  record: IEventPayload | IEventBlock
  delta: any
  onInsertBlock: any
  setDragOverIndex: any
  dragOverIndex: any
  children: any
}

export function Record({
  record,
  delta,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  children,
}: IRecordProps) {
  const ref = useRef<any>()
  const refIndex = useRef<any>(null)
  const isOver = record.eventRecordIndex === dragOverIndex
  const currentIndex = record.eventRecordIndex

  const handleDrop = useCallback(
    (id) => {
      if (!id) return

      setDragOverIndex(-1)
      onInsertBlock({
        blockId: id,
        eventIndex: refIndex?.current,
        newDelta: 10,
      })
      refIndex.current = null
    },
    [onInsertBlock, setDragOverIndex],
  )

  const handleDropOver = useCallback(
    (event: any) => {
      const clientRect = ref.current.getBoundingClientRect()
      const pivot = clientRect.x + RECORD_WIDTH / 2 + delta
      console.log('record', currentIndex)
      if (event.x > pivot) {
        refIndex.current = currentIndex
        setDragOverIndex(currentIndex + 1)
      } else {
        refIndex.current = currentIndex - 1
        setDragOverIndex(currentIndex)
      }
    },
    [currentIndex, setDragOverIndex],
  )

  const handleDropLeave = useCallback(
    () => setDragOverIndex(-1),
    [setDragOverIndex],
  )

  useDrop({
    ref,
    onDrop: handleDrop,
    onDropOver: handleDropOver,
    onDropLeave: handleDropLeave,
  })

  return (
    <div
      ref={ref}
      css={css`
        display: flex;
      `}
    >
      <div>{record.eventRecordIndex}</div>
      <div
        css={css`
          height: 100%;
          background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
          width: ${delta}px;
          opacity: ${isOver ? '0.2' : '1'};
          border-radius: ${isOver ? '10px' : '0px'};
        `}
      />
      {children}
    </div>
  )
}
