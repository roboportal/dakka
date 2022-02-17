import { css } from '@emotion/react'
import {
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

import useExport from './useExport'
import { exportOptions } from './constants'

const options = [
  [exportOptions.cypress, 'Cypress'],
  [exportOptions.playwright, 'Playwright'],
  [exportOptions.puppeteer, 'Puppeteer'],
]

const ExportPanel = () => {
  const {
    exportOption,
    handleChange,
    handleCopyToClipboard,
    handleSaveToFile,
    areButtonsDisabled,
  } = useExport()

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
    >
      <FormControl variant="standard">
        <Select
          css={css`
            font-size: 0.8rem;
          `}
          value={exportOption}
          onChange={handleChange}
          size="small"
        >
          <MenuItem disabled value={exportOptions.none}>
            <Tooltip title="Copy To Clipboard">
              <div
                css={css`
                  font-size: 0.8rem;
                `}
              >
                Export as
              </div>
            </Tooltip>
          </MenuItem>
          {options.map(([value, label]) => (
            <MenuItem
              key={value}
              value={value}
              css={css`
                font-size: 0.8rem;
              `}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          margin-left: 16px;
          button {
            margin-right: 4px;
          }
        `}
      >
        <Tooltip title="Copy To Clipboard">
          <span>
            <IconButton
              disabled={areButtonsDisabled}
              aria-label="copy"
              color="primary"
              size="small"
              onClick={handleCopyToClipboard}
            >
              <ContentCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Save As File">
          <span>
            <IconButton
              disabled={areButtonsDisabled}
              aria-label="save"
              color="primary"
              size="small"
              onClick={handleSaveToFile}
            >
              <SaveOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

export default ExportPanel
