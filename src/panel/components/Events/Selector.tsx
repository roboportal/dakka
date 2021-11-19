import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { blue } from '@mui/material/colors'
import { css } from '@emotion/react'

import {
  IEventPayload,
  ISelector,
  ISelectorPayload,
} from '../../redux/eventRecorderSlice'
import { useCallback } from 'react'

interface ISelectorProp {
  record: IEventPayload
  handleSelectSelector: (payload: ISelectorPayload) => void
}

export function Selector({ record, handleSelectSelector }: ISelectorProp) {
  if (!record?.validSelectors?.length) {
    return null
  }

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = record?.validSelectors?.find(
        (s) => s.value === e.target.value,
      )
      if (selector) {
        handleSelectSelector({ selectedSelector: selector, record })
      }
    },
    [handleSelectSelector, record],
  )

  return (
    <Select
      css={css`
        width: 88px;

        > div {
          padding: 4px;
          font-size: 12px;
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
