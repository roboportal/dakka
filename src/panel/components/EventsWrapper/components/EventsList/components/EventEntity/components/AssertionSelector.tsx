import { useCallback, useState } from 'react'
import { css } from '@emotion/react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

import { IEventBlock, IAssertionPayload } from 'store/eventRecorderSlice'
import {
  assertionsList,
  assertionsListNegative,
  assertionTypes,
} from 'constants/assertion'
import { Label } from './Label'

interface IAssertionSelectorProp {
  record: IEventBlock
  onSetAssertProperties: (payload: IAssertionPayload) => void
  isExpanded: boolean
  prefersDarkMode: boolean
}

const requireInputAsserts = [
  assertionTypes.contains,
  // assertionTypes.equals,
  assertionTypes.hasAttribute,
]

export function AssertionSelector({
  record,
  onSetAssertProperties,
  isExpanded,
  prefersDarkMode,
}: IAssertionSelectorProp) {
  const { assertionType, assertionAttribute, assertionValue } =
    record as IEventBlock
  const [checked, setChecked] = useState(true)
  const [assertions, setAssertions] = useState(assertionsList)

  const handleCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      const assertionList = checked ? assertionsList : assertionsListNegative

      const assertionIndex = assertions.findIndex(
        (it) => it.type === assertionType?.type,
      )
      setChecked(checked)
      setAssertions(assertionList)

      onSetAssertProperties({
        recordId: record.id,
        assertionType: assertionList[assertionIndex],
      })
    },
    [
      setChecked,
      setAssertions,
      assertionType,
      onSetAssertProperties,
      record,
      assertions,
    ],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selection = assertions.find((item) => item.name === e.target.value)

      const _assertionValue = ['', assertionTypes.inDocument].includes(
        selection?.type ?? '',
      )
        ? ''
        : assertionValue

      const _assertionAttribute =
        selection?.type === assertionTypes.hasAttribute
          ? assertionAttribute
          : ''

      onSetAssertProperties({
        recordId: record.id,
        assertionType: selection || {},
        assertionValue: _assertionValue,
        assertionAttribute: _assertionAttribute,
      })
    },
    [
      onSetAssertProperties,
      assertions,
      record,
      assertionValue,
      assertionAttribute,
    ],
  )

  const handleAssertValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSetAssertProperties({
        recordId: record.id,
        assertionValue: e.target.value,
      })
    },
    [record, onSetAssertProperties],
  )

  const handleAssertAttributeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSetAssertProperties({
        recordId: record.id,
        assertionAttribute: e.target.value,
      })
    },
    [record, onSetAssertProperties],
  )

  if (!isExpanded) {
    const type = record?.assertionType?.name ?? ''
    const attribute = record?.assertionAttribute ?? ''
    const value = record?.assertionValue ?? ''
    return (
      <div
        css={css`
          border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
          text-align: start;
          pointer-events: ${isExpanded ? 'auto' : 'none'};
        `}
      >
        <Label label="Type" value={type} />
        <Label label="Attribute" value={attribute} />
        <Label label="Value" value={value} />
      </div>
    )
  }
  return (
    <div
      css={css`
        width: 100%;
        padding: 0.5rem 1.5rem;
        border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          width: 100%;
        `}
      >
        <FormControl
          css={css`
            width: 100%;
          `}
          variant="standard"
        >
          <Select
            css={css`
              width: 100%;
              height: 30px;
              margin-bottom: 0.5rem;
            `}
            displayEmpty
            value={assertionType?.name ?? ''}
            onChange={handleSelectorChange}
            label="Assertion Type"
            labelId="assertion-label-id"
            id="assertion-id"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {assertions?.map((item: Record<string, string>) => {
              return (
                <MenuItem value={item.name} key={item.type}>
                  {item.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControlLabel
          css={css`
            width: 80px;
            margin-left: 0.5rem;
          `}
          control={<Checkbox checked={checked} onChange={handleCheckbox} />}
          label={checked ? 'True' : 'False'}
        />
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        {assertionType?.type === assertionTypes.hasAttribute && (
          <TextField
            css={css`
              display: block;
            `}
            fullWidth
            value={record?.assertionAttribute}
            size="small"
            id="value-assert"
            variant="outlined"
            placeholder="Enter attribute"
            onChange={handleAssertAttributeChange}
          />
        )}

        {requireInputAsserts.includes(
          assertionType?.type as assertionTypes,
        ) && (
          <TextField
            css={css`
              display: block;
              margin-left: 4px;
            `}
            fullWidth
            value={record?.assertionValue}
            size="small"
            id="value-assert"
            variant="outlined"
            placeholder="Enter value"
            onChange={handleAssertValueChange}
          />
        )}
      </div>
    </div>
  )
}
