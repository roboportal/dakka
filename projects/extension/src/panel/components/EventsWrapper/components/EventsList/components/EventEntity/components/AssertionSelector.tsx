import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { css } from '@emotion/react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Autocomplete from '@mui/material/Autocomplete'

import { IEventBlock } from '@roboportal/types'
import {
  assertionsList,
  assertionsListNegative,
  assertionTypes,
} from '@roboportal/constants/assertion'

import {
  IAssertionPayload,
  setAssertionProperties,
} from '@/store/eventRecorderSlice'

import { Label } from './Label'

interface IAssertionSelectorProp {
  record: IEventBlock
  isExpanded: boolean
  prefersDarkMode: boolean
}

const requireInputAsserts = [
  assertionTypes.contains,
  assertionTypes.notContains,
  assertionTypes.equals,
  assertionTypes.notEquals,
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
  isExpanded,
  prefersDarkMode,
}: IAssertionSelectorProp) {
  const { assertionType, assertionAttribute, assertionValue } =
    record as IEventBlock
  const [checked, setChecked] = useState(true)
  const [assertions, setAssertions] = useState(assertionsList)

  const dispatch = useDispatch()

  const handleSetAssertProperties = useCallback(
    (payload: IAssertionPayload) => dispatch(setAssertionProperties(payload)),
    [dispatch],
  )

  useEffect(() => {
    if (
      [
        assertionTypes.contains,
        assertionTypes.notContains,
        assertionTypes.equals,
        assertionTypes.notEquals,
      ].includes(assertionType?.type as assertionTypes)
    ) {
      handleSetAssertProperties({
        recordId: record.id,
        assertionValue: record.assertionValue ?? record?.element?.text ?? '',
      })
      return
    }

    if (
      [assertionTypes.hasAttribute, assertionTypes.notHasAttribute].includes(
        assertionType?.type as assertionTypes,
      )
    ) {
      const firstElementAttributeName =
        Object.keys(record?.element?.attributesMap ?? {})[0] ?? ''

      const firstElementAttributeValue =
        record?.element?.attributesMap?.[firstElementAttributeName] ?? ''

      handleSetAssertProperties({
        recordId: record.id,
        assertionValue: record.assertionValue ?? firstElementAttributeValue,
        assertionAttribute:
          record.assertionAttribute ?? firstElementAttributeName,
      })
      return
    }
  }, [record, assertionType?.type, handleSetAssertProperties])

  const handleCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      const assertionList = checked ? assertionsList : assertionsListNegative

      const assertionIndex = assertions.findIndex(
        (it) => it.type === assertionType?.type,
      )
      setChecked(checked)
      setAssertions(assertionList)

      handleSetAssertProperties({
        recordId: record.id,
        assertionType: assertionList[assertionIndex],
      })
    },
    [
      setChecked,
      setAssertions,
      assertionType,
      handleSetAssertProperties,
      record,
      assertions,
    ],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selection = assertions.find((item) => item.name === e.target.value)

      const firstElementAttributeName =
        Object.keys(record?.element?.attributesMap ?? {})[0] ?? ''
      const firstElementAttributeValue =
        record?.element?.attributesMap?.[firstElementAttributeName] ?? ''

      const assertionValuesMap: Record<string, string> = {
        [assertionTypes.toHaveTitle]:
          (record?.element?.title || record?.title) ?? '',
        [assertionTypes.notToHaveTitle]:
          (record?.element?.title || record?.title) ?? '',

        [assertionTypes.toHaveURL]: (record?.element?.url || record?.url) ?? '',
        [assertionTypes.notToHaveURL]:
          (record?.element?.url || record?.url) ?? '',

        [assertionTypes.equals]: record?.element?.text ?? '',
        [assertionTypes.notEquals]: record?.element?.text ?? '',

        [assertionTypes.contains]: record?.element?.text ?? '',
        [assertionTypes.notContains]: record?.element?.text ?? '',

        [assertionTypes.hasAttribute]: firstElementAttributeValue,
        [assertionTypes.notHasAttribute]: firstElementAttributeValue,

        [assertionTypes.toHaveLength]: '1',
        [assertionTypes.notToHaveLength]: '1',
      }

      const autoPopulatedValue = assertionValuesMap[selection?.type ?? '']

      const _assertionValue = ['', assertionTypes.inDocument].includes(
        selection?.type ?? '',
      )
        ? ''
        : autoPopulatedValue ?? assertionValue

      const _assertionAttribute = [
        assertionTypes.hasAttribute,
        assertionTypes.notHasAttribute,
      ].includes(selection?.type as assertionTypes)
        ? assertionAttribute ?? firstElementAttributeName
        : ''

      handleSetAssertProperties({
        recordId: record.id,
        assertionType: selection ?? {},
        assertionValue: _assertionValue,
        assertionAttribute: _assertionAttribute,
      })
    },
    [
      handleSetAssertProperties,
      assertions,
      record,
      assertionValue,
      assertionAttribute,
    ],
  )

  const handleAssertValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSetAssertProperties({
        recordId: record.id,
        assertionValue: e.target.value,
      })
    },
    [record, handleSetAssertProperties],
  )

  const handleAssertAttributeChange = useCallback(
    (e: React.SyntheticEvent, value = '') => {
      const _value = value ?? ''
      const options: IAssertionPayload = {
        recordId: record.id,
        assertionAttribute: _value,
      }
      const attributesMap = record.element?.attributesMap ?? {}

      if (attributesMap[_value]) {
        options.assertionValue = attributesMap[_value]
      }

      handleSetAssertProperties(options)
    },
    [record, handleSetAssertProperties],
  )

  const attributeSelectOptions = Object.keys(
    record.element?.attributesMap ?? {},
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
              font-size: 0.8rem;

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
            <Autocomplete
              freeSolo
              options={attributeSelectOptions}
              onChange={handleAssertAttributeChange}
              onInputChange={handleAssertAttributeChange}
              value={record?.assertionAttribute ?? ''}
              blurOnSelect
              size="small"
              fullWidth
              css={css`
                display: block;
                margin-left: 0px;
                width: 45%;

                input {
                  font-size: 0.8rem;
                }
                label {
                  font-size: 0.8rem;
                }

                .Mui-focused,
                .MuiFormLabel-filled {
                  font-size: 0.9rem;
                }
              `}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    record?.assertionInputsValidationResult?.assertionAttribute
                  }
                  label="Attribute Name"
                />
              )}
            />

            <div
              css={css`
                margin-left: 4px;
                margin-right: 4px;
                line-height: 1.8rem;
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

              label {
                font-size: 0.8rem;
              }

              .Mui-focused,
              .MuiFormLabel-filled {
                font-size: 0.9rem;
              }
            `}
            error={record?.assertionInputsValidationResult?.assertionValue}
            fullWidth
            value={record?.assertionValue ?? ''}
            size="small"
            id="value-assert"
            variant="outlined"
            label="Value"
            onChange={handleAssertValueChange}
            inputProps={{
              style: {
                fontSize: '0.8rem',
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
