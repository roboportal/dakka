import { useCallback, useState } from 'react'
import { css } from '@emotion/react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

import { IEventBlock, IAssetionPaylod } from 'store/eventRecorderSlice'

interface IAssertionSelectorProp {
  record: IEventBlock
  onSetAssertProperties: (payload: IAssetionPaylod) => void
  isExpanded: boolean
}

const assertionsList: Record<string, string>[] = [
  { type: 'in-document', name: 'Is in document' },
  { type: 'contains', name: 'Contains' },
  { type: 'equals', name: 'Equals' },
  { type: 'has-attribute', name: 'Has attribute' },
]

const assertionsListNegative: Record<string, string>[] = [
  { type: 'contains', name: 'Not Contains' },
  { type: 'in-document', name: 'Is not in document' },
  { type: 'equals', name: 'Not equals' },
  { type: 'has-attribute', name: 'Has not attribute' },
]

const requireInputAsserts = ['contains', 'equals', 'has-attribute']

export function AssertionSelector({
  record,
  onSetAssertProperties,
  isExpanded,
}: IAssertionSelectorProp) {
  const { assertionType, assertionAttribute, assertionValue } =
    record as IEventBlock
  const [checked, setChecked] = useState(true)
  const [assertions, setAssertions] = useState(assertionsList)

  const handleCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      const assetionList = checked ? assertionsList : assertionsListNegative
      setChecked(checked)
      setAssertions(assetionList)
      onSetAssertProperties({
        recordId: record.id,
        assertionType: assetionList.find(
          (item) => item.type === assertionType?.type,
        ),
      })
    },
    [setChecked, setAssertions, assertionType, onSetAssertProperties, record],
  )

  const handleSelectorChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const selection = assertions.find((item) => item.name === e.target.value)
      onSetAssertProperties({
        recordId: record.id,
        assertionType: selection || {},
        assertionValue: selection?.type === 'in-document' ? '' : assertionValue,
        assertionAttribute:
          selection?.type === 'has-attribute' ? assertionAttribute : '',
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

  return (
    <div
      css={css`
        width: 100%;
        padding: 0.5rem 1.5rem;
        filter: blur(${isExpanded ? '0px' : '0.7px'});
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
        {assertionType?.type === 'has-attribute' && (
          <TextField
            css={css`
              display: block;
            `}
            fullWidth
            size="small"
            id="value-assert"
            variant="outlined"
            placeholder="Enter attribute"
            onChange={handleAssertAttributeChange}
          />
        )}

        {requireInputAsserts.includes(assertionType?.type as string) && (
          <TextField
            css={css`
              display: block;
              margin-left: 4px;
            `}
            fullWidth
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
