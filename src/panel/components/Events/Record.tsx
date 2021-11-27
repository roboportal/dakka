import React, { useRef, useCallback } from 'react'
import { css } from '@emotion/react'
import { useDrop } from '../../hooks/dnd/useDrop'
import { IEventPayload, IEventBlock } from '../../redux/eventRecorderSlice'

const RECORD_WIDTH = 88
const DEFAULT_DELTA_TIME = 10

interface IRecordProps {
  delta: number
  triggeredAt: number
  onInsertBlock: (value: any) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  children: React.ReactNode
  index: number
  events: (IEventPayload | IEventPayload[] | IEventBlock)[]
  record: IEventPayload | IEventBlock | IEventPayload[]
}

interface DropZone {
  isOver?: boolean
  delta?: number
}

export function DropZone({ isOver, delta = DEFAULT_DELTA_TIME }: DropZone) {
  return (
    <div
      css={css`
        background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
        width: ${delta}px;
        opacity: ${isOver ? '0.2' : '1'};
        border-radius: ${isOver ? '10px' : '0px'};
      `}
    />
  )
}

export function Record({
  delta,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  children,
  index: currentIndex,
  triggeredAt,
  events,
}: IRecordProps) {
  const ref = useRef<HTMLDivElement>(null)
  const refIndex = useRef<number | null>(null)
  const isOver = currentIndex === dragOverIndex

  const handleDrop = useCallback(
    (type) => {
      if (!type) return

      setDragOverIndex(-1)
      onInsertBlock({
        type,
        eventIndex: refIndex?.current,
        deltaTime: DEFAULT_DELTA_TIME,
        triggeredAt: triggeredAt + DEFAULT_DELTA_TIME,
      })
      refIndex.current = null
    },
    [onInsertBlock, setDragOverIndex],
  )

  const handleDropOver = useCallback(
    (event: DragEvent) => {
      const clientRect = ref.current?.getBoundingClientRect()

      if (!clientRect) return

      let newDelta = delta === 0 ? DEFAULT_DELTA_TIME : delta
      const pivot = clientRect?.x + RECORD_WIDTH / 2 + newDelta

      if (event.x > pivot) {
        refIndex.current = currentIndex
        const nextIndex = currentIndex + 1
        if (nextIndex !== dragOverIndex) {
          setDragOverIndex(nextIndex)
        }
      } else {
        const nextIndex = currentIndex - 1
        refIndex.current = nextIndex
        if (nextIndex !== dragOverIndex) {
          setDragOverIndex(currentIndex)
        }
      }
    },
    [currentIndex, setDragOverIndex],
  )

  useDrop({
    ref,
    onDrop: handleDrop,
    onDropOver: handleDropOver,
  })

  return (
    <div
      ref={ref}
      css={css`
        display: flex;
        height: inherit;
      `}
    >
      <DropZone
        isOver={isOver}
        delta={currentIndex === 0 ? DEFAULT_DELTA_TIME : delta}
      />
      {children}
      {events.length - 1 === currentIndex && (
        <DropZone
          isOver={dragOverIndex === events.length}
          delta={DEFAULT_DELTA_TIME}
        />
      )}
    </div>
  )
}
