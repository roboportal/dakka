import React, { useRef, useCallback } from 'react'
import { css } from '@emotion/react'

import { useDrop } from 'hooks/dnd/useDrop'
import {
  EventListItem,
  IEventPayload,
  IEventBlock,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import { RECORD_WIDTH, DEFAULT_DELTA_TIME } from './constants/defaults'

import { DropZone } from './components/DropZone'

const RIGHT_DROP_ZONE_CLASS_NAME = 'right_drop'

interface IRecordProps {
  onInsertBlock: (value: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  children: React.ReactNode
  events: EventListItem[]
  record: IEventPayload | IEventBlock
  currentIndex: number
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
  const { deltaTime } = record
  const ref = useRef<HTMLDivElement>(null)
  const refIndex = useRef<number | null>(null)
  const isOver = currentIndex === dragOverIndex

  const handleDrop = useCallback(
    (type) => {
      if (!type || refIndex?.current === null) return

      const event = events[refIndex?.current]
      const newtriggeredAt = event
        ? ((event as IEventPayload[])?.[0] ?? event).triggeredAt +
          DEFAULT_DELTA_TIME
        : 0

      setDragOverIndex(Number.MAX_SAFE_INTEGER)
      onInsertBlock({
        type,
        eventIndex: refIndex?.current,
        deltaTime: DEFAULT_DELTA_TIME,
        triggeredAt: newtriggeredAt,
      })
      refIndex.current = null
    },
    [onInsertBlock, setDragOverIndex, events],
  )

  const handleDropOver = useCallback(
    (event: DragEvent) => {
      const clientRect = ref.current?.getBoundingClientRect()

      if (!clientRect) return

      const newDelta = deltaTime === 0 ? DEFAULT_DELTA_TIME : deltaTime
      const pivot = clientRect?.x + RECORD_WIDTH / 2 + newDelta

      if (event.x > pivot) {
        refIndex.current = currentIndex
        const nextIndex = currentIndex + 1
        if (nextIndex !== dragOverIndex) {
          setDragOverIndex(nextIndex)
        }
      } else {
        const prevIndex = currentIndex - 1
        refIndex.current = prevIndex
        if (prevIndex !== dragOverIndex) {
          setDragOverIndex(currentIndex)
        }
      }
    },
    [currentIndex, setDragOverIndex, deltaTime, dragOverIndex],
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
        height: 100%;
        flex: ${currentIndex === events.length - 1 ? 1 : 0};
        &:last-child {
          .${RIGHT_DROP_ZONE_CLASS_NAME} {
            width: 100%;
          }
        }
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
          className={RIGHT_DROP_ZONE_CLASS_NAME}
        />
      )}
    </div>
  )
}
