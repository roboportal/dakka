import { useEffect, useState } from 'react'
import { css, useTheme } from '@emotion/react'
import { useMediaQuery } from '@mui/material'

import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

import {
  REQUEST_GENERATED_TEST,
  RESPOND_GENERATED_TEST,
} from '@roboportal/constants/messageTypes'

interface GeneratedTestEvent {
  type: string
  payload: {
    text: string
  }
}

export default function App() {
  const [generatedTest, setGeneratedTest] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useTheme()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    const messageHandler = (
      event: GeneratedTestEvent,
      sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse()
      if (event.type === RESPOND_GENERATED_TEST) {
        setGeneratedTest(event.payload.text)
      }
    }

    chrome.runtime.sendMessage({
      id: chrome.runtime.id,
      type: REQUEST_GENERATED_TEST,
    })
    chrome.runtime.onMessage.addListener(messageHandler)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [])

  if (generatedTest) {
    return (
      <div
        css={css`
          margin: 16px;
        `}
      >
        <h3>Generated test</h3>
        <SyntaxHighlighter
          language="javascript"
          showLineNumbers
          style={prefersDarkMode ? a11yDark : a11yLight}
          customStyle={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          {generatedTest}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <div
      css={css`
        margin: 20px;
        background-color: 'background.default';
        min-width: 240px;
      `}
    >
      <h3>Recorded test will appear here</h3>
    </div>
  )
}
