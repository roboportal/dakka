import { css } from '@emotion/react'
import TextField from '@mui/material/TextField'
import { ChangeEventHandler } from 'react'
import { IEventBlock } from 'store/eventRecorderSlice'
import { ASSERTION } from 'constants/actionTypes'

interface IEventEntityProps {
  label?: string
  value?: string
  isExpanded?: boolean
  isLast?: boolean
  prefersDarkMode: boolean
  isDividerVisible?: boolean
  record?: IEventBlock
  isAddCustomSelector?: boolean
  onAddCustomSelector?: ChangeEventHandler<HTMLInputElement>
}

export function EntryRow({
  label,
  value,
  isExpanded,
  isLast,
  prefersDarkMode,
  isDividerVisible = true,
  record,
  isAddCustomSelector,
  onAddCustomSelector,
}: IEventEntityProps) {
  const isAddSelector =
    record?.type === ASSERTION && isAddCustomSelector && isExpanded

  return (
    <div
      css={css`
        ${isDividerVisible
          ? `border-bottom: 1px solid ${
              prefersDarkMode ? '#196194' : '#455a64'
            };`
          : ''}
        text-align: start;
        pointer-events: ${isExpanded ? 'auto' : 'none'};
        margin-bottom: ${isLast ? '0px' : '8px'};
        word-wrap: break-word;
        height: 100%;
      `}
    >
      {isAddSelector ? (
        <div
          css={css`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 4px;
          `}
        >
          <TextField
            css={css`
              display: block;
              margin-top: 12px;
              padding: 0;
              width: 95%;

              label {
                font-size: 0.8rem;
              }

              .Mui-focused,
              .MuiFormLabel-filled {
                font-size: 0.9rem;
              }
            `}
            fullWidth
            inputProps={{
              style: {
                fontSize: '0.8rem',
              },
            }}
            value={value}
            error={!value}
            size="small"
            id="custom-assert-selector"
            variant="outlined"
            label="Selector Override"
            onChange={onAddCustomSelector}
          />
        </div>
      ) : (
        label &&
        value && (
          <div>
            <div
              css={css`
                color: #b0bec5;
              `}
            >
              {label}
            </div>
            <div
              css={css`
                color: #eceff1;
                margin-bottom: 4px;
                word-break: break-word;
              `}
            >
              {value}
            </div>
          </div>
        )
      )}
    </div>
  )
}
