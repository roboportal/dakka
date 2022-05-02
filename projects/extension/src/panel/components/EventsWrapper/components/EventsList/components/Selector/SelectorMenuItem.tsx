import { css } from '@emotion/react'
import { red, green, orange, grey } from '@mui/material/colors'
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { SvgIconTypeMap, Tooltip } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

import { ISelector } from '@roboportal/types'

interface Item {
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & {
    muiName: string
  }
  color: string
  text: string
}

const items: Record<number, Item> = {
  1: {
    icon: CheckCircle,
    color: green[600],
    text: 'Recommended - stable, isolated from changes.',
  },
  2: {
    icon: WarningAmberIcon,
    color: orange[600],
    text: 'Occasionally recommended - coupled to styling, HTML or JS.',
  },
  3: {
    icon: WarningAmberIcon,
    color: red[400],
    text: 'Not recommended - selector is too generic or prone to change.',
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
