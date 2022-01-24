import React, { useRef, useCallback } from 'react'
import { css } from '@emotion/react'

import { useDrop } from 'hooks/dnd/useDrop'
import {
  EventListItem,
  IEventPayload,
  IEventBlock,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import { RECORD_WIDTH, GAP_BETWEEN_RECORDS } from './constants/defaults'

import { DropZone } from './components/DropZone'

const RIGHT_DROP_ZONE_CLASS_NAME = 'right_drop'
const LEFT_DROP_ZONE_CLASS_NAME = 'left_drop'

interface IRecordProps {
  onInsertBlock: (value: IEventBlockPayload) => void
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  children: React.ReactNode
  events: EventListItem[]
  record: IEventPayload | IEventBlock
  currentIndex: number
  isFirstRecord: boolean
}

export function Record({
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
  children,
  events,
  currentIndex,
  isFirstRecord,
}: IRecordProps) {
  const ref = useRef<HTMLDivElement>(null)
  const refIndex = useRef<number | null>(null)
  const isOver = currentIndex === dragOverIndex

  const handleDrop = useCallback(
    (type) => {
      if (!type || refIndex?.current === null || isFirstRecord) return

      setDragOverIndex(Number.MAX_SAFE_INTEGER)
      onInsertBlock({
        type,
        eventIndex: refIndex?.current,
      })
      refIndex.current = null
    },
    [onInsertBlock, setDragOverIndex, isFirstRecord],
  )

  const handleDropOver = useCallback(
    (event: DragEvent) => {
      const clientRect = ref.current?.getBoundingClientRect()

      if (!clientRect) return

      const pivot = clientRect?.x + RECORD_WIDTH / 2 + GAP_BETWEEN_RECORDS

      if (event.x > pivot && !isFirstRecord) {
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
    [currentIndex, setDragOverIndex, dragOverIndex, isFirstRecord],
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
        height: calc(100vh - 52px - 68px);
        flex: ${currentIndex === events.length - 1 ? 1 : 0};
        &:last-child {
          .${RIGHT_DROP_ZONE_CLASS_NAME} {
            width: 100%;
          }
        }
        .${LEFT_DROP_ZONE_CLASS_NAME} {
          height: calc(100vh - 68px - 24px);
        }
        .${RIGHT_DROP_ZONE_CLASS_NAME} {
          height: calc(100vh - 68px - 24px);
        }
      `}
    >
      <DropZone
        isOver={isOver && !isFirstRecord}
        gap={GAP_BETWEEN_RECORDS}
        className={LEFT_DROP_ZONE_CLASS_NAME}
      />
      {children}
      {events.length - 1 === currentIndex && (
        <DropZone
          isOver={dragOverIndex === events.length}
          gap={GAP_BETWEEN_RECORDS}
          className={RIGHT_DROP_ZONE_CLASS_NAME}
        />
      )}
    </div>
  )
}
