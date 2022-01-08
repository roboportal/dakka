import { useCallback, useMemo } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { blue } from '@mui/material/colors'
import { css } from '@emotion/react'

import {
  IEventBlock,
  IEventPayload,
  ISelector,
  ISelectorPayload,
} from 'store/eventRecorderSlice'
import { INTERACTIVE_ELEMENT } from 'constants/messageTypes'

interface ISelectorProp {
  record: IEventPayload | IEventBlock
  onSelectSelector: (payload: ISelectorPayload) => void
  width: string
}

export function Selector({ record, onSelectSelector, width }: ISelectorProp) {
  const validSelectors = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? (record as IEventBlock)?.element?.validSelectors
        : (record as IEventPayload).validSelectors,
    [record],
  )

  const selectedSelector = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? (record as IEventBlock)?.element?.selectedSelector?.value
        : (record as IEventPayload)?.selectedSelector?.value,
    [record],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = validSelectors?.find(
        (s: { value: string }) => s.value === e.target.value,
      )
      if (selector) {
        onSelectSelector({ selectedSelector: selector, record })
      }
    },
    [onSelectSelector, record, validSelectors],
  )

  if (!validSelectors?.length) {
    return null
  }

  return (
    <Select
      css={css`
        width: ${width};

        > div {
          padding: 4px;
        }
      `}
      value={selectedSelector}
      onChange={handleSelectorChange}
      variant="outlined"
    >
      {validSelectors?.map((item: ISelector) => (
        <MenuItem value={item.value} key={`${item.name}${item.value}`}>
          <span>By {item.name}:</span>
          <span
            css={css`
              color: ${blue[600]};
              margin-left: 4px;
            `}
          >
            {item.value}
          </span>
        </MenuItem>
      ))}
    </Select>
  )
}
