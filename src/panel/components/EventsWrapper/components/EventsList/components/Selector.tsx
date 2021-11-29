import { useCallback } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { blue } from '@mui/material/colors'
import { css } from '@emotion/react'

import {
  IEventPayload,
  ISelector,
  ISelectorPayload,
} from 'store/eventRecorderSlice'

interface ISelectorProp {
  record: IEventPayload
  onSelectSelector: (payload: ISelectorPayload) => void
}

export function Selector({ record, onSelectSelector }: ISelectorProp) {
  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = record?.validSelectors?.find(
        (s) => s.value === e.target.value,
      )
      if (selector) {
        onSelectSelector({ selectedSelector: selector, record })
      }
    },
    [onSelectSelector, record],
  )

  if (!record?.validSelectors?.length) {
    return null
  }

  return (
    <Select
      css={css`
        width: 88px;

        > div {
          padding: 4px;
        }
      `}
      value={record?.selectedSelector?.value}
      onChange={handleSelectorChange}
      variant="outlined"
    >
      {record?.validSelectors?.map((item: ISelector) => (
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
