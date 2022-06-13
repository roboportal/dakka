import { nanoid } from 'nanoid'

import { fatal } from '@roboportal/utils/logger'
import { resize } from '@roboportal/constants/browserEvents'
import {
  EVENT_INTERCEPTED,
  HIGHLIGHT_ELEMENT,
  ELEMENT_SELECTED,
  HOVER_ELEMENT,
} from '@roboportal/constants/messageTypes'

import { composeEvent } from './composeEvent'

const extensionId =
  (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
    ?.extid ?? ''

let highLightElement: HTMLDivElement | null = null

const isInIframe = window.location !== window.parent.location

window.addEventListener('message', ({ data }) => {
  if (data?.type === ELEMENT_SELECTED && highLightElement) {
    highLightElement.style.display = 'none'
    return
  }

  const isElementSelect = data?.type === HOVER_ELEMENT

  if (data.type === HIGHLIGHT_ELEMENT || isElementSelect) {
    const selector: string = data.selector || data?.payload?.selector

    if (!highLightElement && selector) {
      const el = document.createElement('div')
      el.style.position = 'fixed'
      el.style.opacity = '0.5'
      el.style.display = 'none'
      el.style.border = '1px dashed gold'
      document.body.append(el)
      highLightElement = el
    }

    if (!highLightElement) {
      return
    }

    highLightElement.style.pointerEvents = isElementSelect ? 'none' : 'auto'
    const green = '#18A558'
    const blue = '#0080ff'
    highLightElement.style.backgroundColor = isElementSelect ? green : blue

    const hoveredElement = document.querySelector(selector)
    const shouldHighlightHoveredElement =
      !isElementSelect &&
      hoveredElement &&
      data.location === window.location.href &&
      data.isInIframe === isInIframe

    const shouldHighlightInteractiveSelector = isElementSelect && hoveredElement

    if (shouldHighlightHoveredElement || shouldHighlightInteractiveSelector) {
      const { top, left, width, height } =
        hoveredElement.getBoundingClientRect() ?? {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }
      if (top && width && left && height) {
        highLightElement.style.top = top + 'px'
        highLightElement.style.width = width + 'px'
        highLightElement.style.left = left + 'px'
        highLightElement.style.height = height + 'px'
        highLightElement.style.display = 'block'
        highLightElement.style.zIndex = '999999999'
      }
    } else {
      highLightElement.style.display = 'none'
    }
  }
})

export function eventHandler(event: any) {
  const { type, target } = event

  try {
    const message = composeEvent({
      event,
      extensionId,
      eventType: EVENT_INTERCEPTED,
    })

    window.postMessage(message)
  } catch (error) {
    fatal('Error sending recorded event:', error, type, target)
  }
}

export function resizeEventHandler(innerWidth: number, innerHeight: number) {
  try {
    const message = {
      id: extensionId,
      type: EVENT_INTERCEPTED,
      payload: {
        id: nanoid(),
        type: resize,
        innerWidth,
        innerHeight,
      },
    }
    window.postMessage(message)
  } catch (error) {
    fatal('Error sending recorded event:', error)
  }
}

export function changeEventHandler(event: any) {
  try {
    const isTargetFileInput = !!event.target?.files?.length

    if (isTargetFileInput) {
      const message = composeEvent({
        event: event,
        extensionId,
        eventType: EVENT_INTERCEPTED,
      })
      window.postMessage(message)
    }
  } catch (error) {
    fatal('Error sending recorded event:', error)
  }
}
