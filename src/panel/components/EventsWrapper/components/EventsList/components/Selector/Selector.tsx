import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import { css } from '@emotion/react'
import MenuItem from '@mui/material/MenuItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { grey } from '@mui/material/colors'

import {
  selectEventSelector,
  IEventBlock,
  ISelector,
} from '@/store/eventRecorderSlice'
import { getActiveTabId } from '@/store/eventSelectors'
import { INTERACTIVE_ELEMENT } from '@/constants/messageTypes'

import { Divider } from './Divider'
import { SelectorMenuItem } from './SelectorMenuItem'

interface ISelectorProp {
  record: IEventBlock
  width: string
}

export function Selector({ record, width }: ISelectorProp) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const dispatch = useDispatch()

  const activeTabID = useSelector(getActiveTabId)

  const validSelectors = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.validSelectors
        : record.validSelectors,
    [record],
  )

  const selectorsHighPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 1 && closest !== 1,
      ),
    [validSelectors],
  )

  const selectorsMediumPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 2 && closest !== 1,
      ),
    [validSelectors],
  )

  const selectorsLowPriority = useMemo(
    () =>
      validSelectors?.filter(
        ({ priority, closest }) => priority === 3 && closest !== 1,
      ),
    [validSelectors],
  )

  const closestSelectors = useMemo(
    () =>
      validSelectors?.filter(
        ({ closest, priority }) =>
          closest === 1 && (priority === 2 || priority === 1),
      ),
    [validSelectors],
  )

  const selectedSelector = useMemo(
    () =>
      record?.variant === INTERACTIVE_ELEMENT
        ? record?.element?.selectedSelector?.value
        : record?.selectedSelector?.value,
    [record],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selector = validSelectors?.find(
        (s: { value: string }) => s.value === e.target.value,
      )

      if (selector) {
        dispatch(
          selectEventSelector({
            selectedSelector: selector,
            record,
            tabId: activeTabID,
          }),
        )
      }
    },
    [record, validSelectors, activeTabID, dispatch],
  )

  const shouldHideSelectorPanel =
    !validSelectors?.length || !(record.shouldUseElementSelector ?? true)

  if (shouldHideSelectorPanel) {
    return null
  }

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
