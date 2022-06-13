import { css } from '@emotion/react'

interface IFileEntryRowProps {
  files: Array<{ name: string }>
  isExpanded?: boolean
  prefersDarkMode: boolean
}

export function FileEntryRow({
  files,
  prefersDarkMode,
  isExpanded,
}: IFileEntryRowProps) {
  return (
    <div
      css={css`
        border-bottom: 1px solid ${prefersDarkMode ? '#196194' : '#455a64'};
        text-align: start;
        pointer-events: ${isExpanded ? 'auto' : 'none'};
        word-wrap: break-word;
        height: 100%;
      `}
    >
      <div>
        <div
          css={css`
            color: #b0bec5;
          `}
        >
          Files
        </div>
        <div
          css={css`
            color: #eceff1;
            margin-bottom: 4px;
            word-break: break-word;
            display: flex;
            flex-direction: row;
          `}
        >
          {files.map((f) => (
            <div key={f.name}>{f.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
