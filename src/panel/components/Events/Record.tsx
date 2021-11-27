import React, { useRef, useCallback } from 'react'
import { css } from '@emotion/react'
import { useDrop } from '../../hooks/dnd/useDrop'
import {
  IEventPayload,
  IEventBlock,
  IEventBlockPayload,
} from '../../redux/eventRecorderSlice'

const RECORD_WIDTH = 88
const DEFAULT_DELTA_TIME = 10

interface IRecordProps {
  onInsertBlock: (value: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  children: React.ReactNode
  events: (IEventPayload | IEventPayload[] | IEventBlock)[]
  record: IEventPayload | IEventBlock
  currentIndex: number
}

interface DropZone {
  isOver?: boolean
  deltaTime?: number
}

export function DropZone({ isOver, deltaTime = DEFAULT_DELTA_TIME }: DropZone) {
  return (
    <div
      css={css`
        background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
        width: ${deltaTime}px;
        opacity: ${isOver ? '0.2' : '1'};
        border-radius: ${isOver ? '10px' : '0px'};
      `}
    />
  )
}

export function Record({
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  children,
  events,
  record,
  currentIndex,
}: IRecordProps) {
  const { deltaTime, triggeredAt } = record
  const ref = useRef<HTMLDivElement>(null)
  const refIndex = useRef<number | null>(null)
  const isOver = currentIndex === dragOverIndex

  const handleDrop = useCallback(
    (type) => {
      if (!type || refIndex?.current === null) return

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

      let newDelta = deltaTime === 0 ? DEFAULT_DELTA_TIME : deltaTime
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
        deltaTime={currentIndex === 0 ? DEFAULT_DELTA_TIME : deltaTime}
      />
      {children}
      {events.length - 1 === currentIndex && (
        <DropZone
          isOver={dragOverIndex === events.length}
          deltaTime={DEFAULT_DELTA_TIME}
        />
      )}
    </div>
  )
}
