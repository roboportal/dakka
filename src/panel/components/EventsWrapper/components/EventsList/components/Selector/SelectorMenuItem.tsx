import { red, green, orange, grey } from '@mui/material/colors'
import { css } from '@emotion/react'
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { Tooltip } from '@mui/material'
import { ISelector } from 'store/eventRecorderSlice'

const items: Record<number, any> = {
  1: {
    icon: CheckCircle,
    color: green[600],
    text: 'Good - stable, isolated from changes.',
  },
  2: {
    icon: WarningAmberIcon,
    color: orange[600],
    text: 'Better  - but coupled to styling, HTML or JS event listeners',
  },
  3: {
    icon: WarningAmberIcon,
    color: red[400],
    text: 'Not so good - selector is too generic and/or prone to change',
  },
}

export const SelectorMenuItem = ({ item }: { item: ISelector }) => {
  const IconTag = items[item.priority]?.icon

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <span>By {item.name}:</span>
      <span
        css={css`
          color: ${grey[600]};
          margin-left: 4px;
        `}
      >
        {item.value}
      </span>
      <Tooltip
        title={
          <div>
            <div>{items[item.priority]?.text}</div>
            <div>
              {item.length} {item.length > 1 ? 'elements' : 'element'} found{' '}
              {item.length > 1 ? '- first is used by default' : ''}
            </div>
          </div>
        }
      >
        <IconTag
          css={css`
            color: ${items[item.priority]?.color};
            font-size: 16px;
            margin-left: 4px;
          `}
        />
      </Tooltip>
    </div>
  )
}
