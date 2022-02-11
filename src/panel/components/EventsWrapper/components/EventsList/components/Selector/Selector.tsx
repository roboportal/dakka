import { useCallback, useMemo } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { css } from '@emotion/react'
import MenuItem from '@mui/material/MenuItem'
import { Divider } from './Divider'
import {
  IEventBlock,
  IEventPayload,
  ISelector,
  ISelectorPayload,
} from 'store/eventRecorderSlice'
import { INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { SelectorMenuItem } from './SelectorMenuItem'

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

  const shouldHideSelectorPanel =
    !validSelectors?.length || !(record.shouldUseElementSelector ?? true)

  if (shouldHideSelectorPanel) {
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
      renderValue={(value: string) => value}
    >
      {selectorsHighPriority?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.7rem;
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
            font-size: 0.7rem;
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
            font-size: 0.7rem;
          `}
          value={item.value}
          key={`${item.name}${item.value}`}
        >
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!closestSelectors?.length && (
        <>
          <Divider />
          <div
            css={css`
              width: 100%;
              color: #1769aa;
              margin-left: 16px;
              font-size: 0.7rem;
              padding-top: 4px;
            `}
          >
            Closest interactive element:
          </div>
        </>
      )}
      {closestSelectors?.map((item: ISelector) => (
        <MenuItem
          css={css`
            font-size: 0.7rem;
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
