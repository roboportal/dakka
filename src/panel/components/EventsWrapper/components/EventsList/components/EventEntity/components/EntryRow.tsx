import { css } from '@emotion/react'
import TextField from '@mui/material/TextField'
import { ChangeEventHandler } from 'react'
import { IEventBlock } from 'store/eventRecorderSlice'

interface IEventEntityProps {
  label?: string
  value?: string
  isExpanded?: boolean
  isLast?: boolean
  prefersDarkMode: boolean
  isDividerVisible?: boolean
  record?: IEventBlock
  isAddCustomSelector?: boolean
  onAddCustomSelector?:
    | ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined
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
    record?.type === 'Assertion' && isAddCustomSelector && isExpanded

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
              margin-top: 8px;
              padding: 0;
            `}
            inputProps={{
              style: {
                padding: 4,
              },
            }}
            size="small"
            id="custom-assert-selector"
            variant="outlined"
            placeholder="Enter selector"
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
