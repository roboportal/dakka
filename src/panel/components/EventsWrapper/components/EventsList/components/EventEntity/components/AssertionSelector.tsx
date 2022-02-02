import { useCallback, useState } from 'react'
import { css } from '@emotion/react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
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
  assertionTypes.notContains,
  assertionTypes.hasAttribute,
  assertionTypes.notHasAttribute,
  assertionTypes.toHaveTitle,
  assertionTypes.notToHaveTitle,
  assertionTypes.toHaveURL,
  assertionTypes.notToHaveURL,
  assertionTypes.toHaveLength,
  assertionTypes.notToHaveLength,
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
        <div
          css={css`
            color: #b0bec5;
          `}
        >
          Expand to set assertion
        </div>
      </div>
    )
  }

  const isAttributeInputVisible = [
    assertionTypes.hasAttribute,
    assertionTypes.notHasAttribute,
  ].includes((assertionType?.type ?? '') as assertionTypes)

  return (
    <div
      css={css`
        width: 100%;
        margin-left: 4px;
        margin-top: 8px;
        border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
        height: 100px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          width: 100%;
          flex-direction: row;
          height: 32px;
          margin-bottom: 20px;
        `}
      >
        <FormControl
          css={css`
            margin-right: 32px;
          `}
          variant="standard"
          size="small"
        >
          <Select
            css={css`
              width: 200px;
              height: 30px;
              font-size: 0.7rem;

              .MuiSelect-select {
                padding-top: 4px;
              }
            `}
            displayEmpty
            value={assertionType?.name ?? ''}
            onChange={handleSelectorChange}
            label="Assertion Type"
            labelId="assertion-label-id"
            id="assertion-id"
          >
            <MenuItem value="">Select assertion</MenuItem>
            {assertions?.map((item: Record<string, string>) => {
              return (
                <MenuItem value={item.name} key={item.type}>
                  {item.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {record.assertionType && (
          <FormControlLabel
            css={css`
              width: 80px;
            `}
            control={
              <Switch
                size="small"
                checked={checked}
                onChange={handleCheckbox}
              />
            }
            label=""
          />
        )}
      </div>
      <div
        css={css`
          display: flex;
        `}
      >
        {isAttributeInputVisible && (
          <>
            <TextField
              css={css`
                display: block;
                margin-left: 0px;
                width: 45%;
              `}
              fullWidth
              value={record?.assertionAttribute ?? ''}
              size="small"
              id="value-assert"
              variant="outlined"
              placeholder="Attribute Name"
              error={
                record?.assertionInputsValidationResult?.assertionAttribute
              }
              onChange={handleAssertAttributeChange}
              inputProps={{
                style: {
                  padding: 4,
                  paddingLeft: 6,
                  fontSize: '0.7rem',
                },
              }}
            />
            <div
              css={css`
                margin-left: 4px;
                margin-right: 4px;
              `}
            >
              =
            </div>
          </>
        )}

        {requireInputAsserts.includes(
          assertionType?.type as assertionTypes,
        ) && (
          <TextField
            css={css`
              display: block;
              margin-left: 0px;
              width: ${isAttributeInputVisible ? '45%' : '95%'};
            `}
            error={record?.assertionInputsValidationResult?.assertionValue}
            fullWidth
            value={record?.assertionValue ?? ''}
            size="small"
            id="value-assert"
            variant="outlined"
            placeholder="Value"
            onChange={handleAssertValueChange}
            inputProps={{
              style: {
                padding: 4,
                paddingLeft: 6,
                fontSize: '0.7rem',
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
