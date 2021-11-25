import { memo, useRef, useCallback, useState } from 'react'
import { css } from '@emotion/react'

import { IEventPayload, IEventBlock } from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'
import { useDrop } from '../../hooks/dnd/useDrop'

interface IRecordProps {
  record: IEventPayload | IEventBlock
  delta: any
  onSelectSelector: any
  index: any
  onInsertBlock: any
  setDragOverIndex: any
  dragOverIndex: any
}

function Record({
  record,
  delta,
  onSelectSelector,
  index,
  onInsertBlock,
  setDragOverIndex,
  dragOverIndex,
}: IRecordProps) {
  const ref = useRef<any>()
  const refIndex = useRef<any>(null)
  const isOver = record.eventRecordIndex === dragOverIndex

  const handleDrop = useCallback(
    (id) => {
      if (onInsertBlock && id) {
        setDragOverIndex(-1)
        onInsertBlock({
          blockId: id,
          eventIndex: refIndex?.current?.eventIndex,
          newDelta: delta,
          newTriggeredAt: refIndex?.current?.triggeredAt,
        })
      }
    },
    [onInsertBlock, setDragOverIndex],
  )

  const handleDropOver = useCallback((event: any) => {
    const clientRect = ref.current.getBoundingClientRect()
    const pivot = clientRect.x + 88 / 2 + delta

    if (event.x > pivot) {
      refIndex.current = {
        eventIndex: (record as IEventPayload).eventRecordIndex,
        triggeredAt: record.triggeredAt + 1,
      }
      setDragOverIndex((record as IEventPayload).eventRecordIndex + 1)
    } else {
      refIndex.current = {
        eventIndex: (record as IEventPayload).eventRecordIndex - 1,
        triggeredAt: record.triggeredAt - 1,
      }
      setDragOverIndex((record as IEventPayload).eventRecordIndex)
    }
  }, [])

  const handleDropLeave = useCallback(() => {
    setDragOverIndex(-1)
  }, [])

  useDrop({
    ref,
    onDrop: handleDrop,
    onDropOver: handleDropOver,
    onDropLeave: handleDropLeave,
  })

  return (
    <div
      ref={ref}
      key={record.id}
      css={css`
        display: flex;
      `}
    >
      <div
        css={css`
          height: 100%;
          background: ${isOver ? 'rgb(144, 202, 249)' : 'transparent'};
          width: ${delta}px;
          opacity: ${isOver ? '0.1' : '1'};
          border-radius: ${isOver ? '10px' : '0px'};
        `}
      />
      <div
        css={css`
          text-align: center;
          width: 88px;
        `}
      >
        <div>{record.triggeredAt}</div>
        <Selector
          record={record as IEventPayload}
          onSelectSelector={onSelectSelector}
        />
        <EventEntity
          record={record as IEventPayload}
          index={index.toString()}
        />
      </div>
    </div>
  )
}

export default memo(Record)
