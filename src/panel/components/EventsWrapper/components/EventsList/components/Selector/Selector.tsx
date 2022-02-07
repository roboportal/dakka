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
    () => validSelectors?.filter(({ priority }) => priority === 1),
    [validSelectors],
  )

  const selectorsMediumPriority = useMemo(
    () => validSelectors?.filter(({ priority }) => priority === 2),
    [validSelectors],
  )

  const selectorsLowPriority = useMemo(
    () => validSelectors?.filter(({ priority }) => priority === 3),
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
      console.log('selector', selector)
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
        <MenuItem value={item.value} key={`${item.name}${item.value}`}>
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!selectorsHighPriority?.length && <Divider />}
      {selectorsMediumPriority?.map((item: ISelector) => (
        <MenuItem value={item.value} key={`${item.name}${item.value}`}>
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
      {!!selectorsMediumPriority?.length && <Divider />}
      {selectorsLowPriority?.map((item: ISelector) => (
        <MenuItem value={item.value} key={`${item.name}${item.value}`}>
          <SelectorMenuItem item={item} key={item.value} />
        </MenuItem>
      ))}
    </Select>
  )
}
