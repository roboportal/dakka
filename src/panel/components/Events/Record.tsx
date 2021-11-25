import { memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload, IEventBlock } from '../../redux/eventRecorderSlice'
import { EventEntity } from './EventEntity'
import { Selector } from './Selector'

interface IRecordProps {
  record: IEventPayload | IEventBlock
  delta: any
  onSelectSelector: any
  index: any
  onInsertBlock: any
}

function Record({
  record,
  delta,
  onSelectSelector,
  index,
  onInsertBlock,
}: IRecordProps) {
  return (
    <div
      key={record.id}
      css={css`
        display: flex;
      `}
    >
      <div
        css={css`
          height: 100%;
          background: red;
          width: ${delta}px;
        `}
      />
      <div
        css={css`
          height: 100%;
        `}
      >
        <div
          css={css`
            text-align: center;
            width: 88px;
          `}
        >
          <div>{(record as IEventPayload).triggeredAt}</div>
          <Selector
            record={record as IEventPayload}
            onSelectSelector={onSelectSelector}
          />
        </div>
        <EventEntity
          record={record as IEventPayload}
          index={index.toString()}
          onInsertBlock={onInsertBlock}
        />
      </div>
    </div>
  )
}

export default memo(Record)
