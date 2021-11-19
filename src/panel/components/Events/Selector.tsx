import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  IEventPayload,
  ISelector,
  ISelectorPayload,
} from '../../redux/eventRecorderSlice'
import { css } from '@emotion/react'

interface ISelectorProp {
  record: IEventPayload
  handleSelectSelector: (payload: ISelectorPayload) => void
}

export function Selector({ record, handleSelectSelector }: ISelectorProp) {
  if (!record?.validSelectors?.length) {
    return null
  }

  const handleSelectorChange = (
    e: SelectChangeEvent<string>,
    { validSelectors }: IEventPayload,
  ) => {
    const selector = validSelectors?.find((s) => s.value === e.target.value)
    if (selector) {
      handleSelectSelector({ selectedSelector: selector, record })
    }
  }

  return (
    <Select
      css={css`
        width: 88px;

        > div {
          padding: 5px;
          font-size: 12px;
        }
      `}
      value={record?.selectedSelector?.value}
      onChange={(e) => handleSelectorChange(e, record)}
      variant="outlined"
    >
      {record?.validSelectors?.map((item: ISelector) => (
        <MenuItem value={item.value} key={`${item.name}${item.value}`}>
          <span>By {item.name}:</span>
          <span
            css={css`
              color: #82b1ff;
              margin-left: 5px;
            `}
          >
            {item.value}
          </span>
        </MenuItem>
      ))}
    </Select>
  )
}
