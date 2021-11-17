import { ChangeEvent } from 'react'
import useEventRecorder from '../../hooks/useEventRecorder'
import { IEventPayload, ISelector } from '../../redux/eventRecorderSlice'
import { css } from '@emotion/react'

export function Selectors({ record }: { record: IEventPayload }) {
  const { handleSelectSelector } = useEventRecorder()

  if (!record?.validSelectors?.length) {
    return null
  }

  const handleSelectorChange = (
    e: ChangeEvent<HTMLSelectElement>,
    { validSelectors }: IEventPayload,
  ) => {
    if (validSelectors) {
      const selector = validSelectors.find((s) => s.value === e.target.value)
      handleSelectSelector({ selectedSelector: selector, record })
    }
  }

  return (
    <select
      css={css`
        width: 88px;
      `}
      value={record?.selectedSelector?.value}
      onChange={(e) => handleSelectorChange(e, record)}
    >
      {record?.validSelectors?.map((item: ISelector) => (
        <option value={item.value} key={`${item.name}${item.value}`}>
          By {item.name}: {item.value}
        </option>
      ))}
    </select>
  )
}
