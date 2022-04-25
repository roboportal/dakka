import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import ControlPanel from '@/components/ControlPanel'
import EventsWrapper from '@/components/EventsWrapper/EventsWrapper'
import AllowInjection from '@/components/AllowInjection'
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel'

import useAllowInjection from '@/hooks/useAllowInjection'
import useToggle from '@/hooks/useToggle'
import useEventRecorder from '@/hooks/useEventRecorder'

export default function App() {
  useEventRecorder()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [isAutoScrollEnabled, toggleAutoScroll] = useToggle(true)

  const { isInjectionAllowed, allowInjection } = useAllowInjection()

  if (!isInjectionAllowed) {
    return <AllowInjection allowInjection={allowInjection} />
  }

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: 'background.default';
      `}
    >
      <ControlPanel
        onAutoScrollToggle={toggleAutoScroll}
        isAutoScrollEnabled={isAutoScrollEnabled}
      />
      <Box
        css={css`
          overflow: hidden;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: calc(100vh - 36px - 8px);
          padding-left: 4px;
          padding-right: 8px;
        `}
      >
        <ProjectPanel />
        <EventsWrapper
          prefersDarkMode={prefersDarkMode}
          autoScroll={isAutoScrollEnabled}
        />
      </Box>
    </div>
  )
}
