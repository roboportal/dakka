import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setIsInjectionAllowed, IEventRecord } from 'store/eventRecorderSlice'
import {
  IS_INJECTION_ALLOWED,
  ALLOW_INJECTING,
  INJECTION_ALLOWED_STATUS,
  REDIRECT_STARTED,
} from 'constants/messageTypes'

import { SLICE_NAMES, RootState } from '../store'

export default function useAllowInjection() {
  const dispatch = useDispatch()
  const { activeTabID, allowedInjections } = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder],
  )

  useEffect(() => {
    if (activeTabID >= 0) {
      chrome.tabs.sendMessage(activeTabID, {
        type: IS_INJECTION_ALLOWED,
      })
    }
  }, [activeTabID])

  useEffect(() => {
    const messageHandler = (
      eventRecord: IEventRecord,
      sender: chrome.runtime.MessageSender,
    ) => {
      if (eventRecord.type === REDIRECT_STARTED) {
        chrome.tabs.sendMessage(activeTabID, {
          type: IS_INJECTION_ALLOWED,
        })
      }
      if (eventRecord.type === INJECTION_ALLOWED_STATUS) {
        const tabId = sender?.tab?.id
        dispatch(
          setIsInjectionAllowed({
            tabId,
            isInjectingAllowed: eventRecord.payload.isInjectingAllowed,
          }),
        )
      }
    }

    chrome.runtime.onMessage.addListener(messageHandler)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [activeTabID, dispatch])

  const allowInjection = useCallback(() => {
    chrome.tabs.sendMessage(activeTabID, {
      type: ALLOW_INJECTING,
    })
    dispatch(
      setIsInjectionAllowed({
        tabId: activeTabID,
        isInjectingAllowed: true,
      }),
    )
  }, [dispatch, activeTabID])

  return {
    isInjectionAllowed: !!allowedInjections[activeTabID],
    allowInjection,
  }
}
