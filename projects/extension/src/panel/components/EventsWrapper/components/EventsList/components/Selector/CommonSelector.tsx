import { css } from '@emotion/react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { grey } from '@mui/material/colors'

import { ISelector } from '@roboportal/types'

import { Divider } from './Divider'
import { SelectorMenuItem } from './SelectorMenuItem'

interface CommonSelectorProps {
  width: string
  selectedSelector?: string
  handleSelectorChange: (e: SelectChangeEvent<string>) => void
  selectorsHighPriority?: ISelector[]
  selectorsMediumPriority?: ISelector[]
  selectorsLowPriority?: ISelector[]
  closestSelectors?: ISelector[]
}

export const CommonSelector = ({
  width,
  selectedSelector,
  handleSelectorChange,
  selectorsHighPriority,
  selectorsMediumPriority,
  selectorsLowPriority,
  closestSelectors,
}: CommonSelectorProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <Select
      css={css`
        width: ${width};
        border: 1px solid ${prefersDarkMode ? grey[800] : grey[300]};
        border-radius: 4px;
        > div {
          padding: 4px;
        }
      `}
      value={selectedSelector}
      onChange={handleSelectorChange}
      variant="standard"
      renderValue={(value: string) => value}
    >
      {selectorsHighPriority?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.8rem;
          `}
          value={item.value}
          key={`${item.name}${item.value}`}
        >
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!selectorsHighPriority?.length && <Divider />}
      {selectorsMediumPriority?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.8rem;
          `}
          value={item.value}
          key={`${item.name}${item.value}`}
        >
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!selectorsMediumPriority?.length && <Divider />}
      {selectorsLowPriority?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.8rem;
          `}
          value={item.value}
          key={`${item.name}${item.value}`}
        >
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!closestSelectors?.length && (
        <div>
          <Divider />
          <div
            css={css`
              width: 100%;
              color: #1769aa;
              margin-left: 16px;
              font-size: 0.8rem;
              padding-top: 4px;
            `}
          >
            Closest interactive element:
          </div>
        </div>
      )}
      {closestSelectors?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.8rem;
          `}
          value={item.value}
          key={`${item.name}${item.value}`}
        >
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
    </Select>
  )
}
