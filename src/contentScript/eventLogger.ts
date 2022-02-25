import { nanoid } from 'nanoid'
import { resize } from '../globalConstants/browserEvents'

import { composeEvent } from './composeEvent'

import { fatal } from '../shared/logger'

import {
  EVENT_INTERCEPTED,
  HIGHLIGHT_ELEMENT,
  ELEMENT_SELECTED,
  HOVER_ELEMENT,
} from '../globalConstants/messageTypes'

const extensionId =
  (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
    ?.extid ?? ''

let highLightElement: HTMLDivElement | null = null

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
    highLightElement.style.backgroundColor = isElementSelect
      ? '#18A558'
      : '#0080ff'

    if (selector) {
      const { top, left, width, height } = document
        .querySelector(selector)
        ?.getBoundingClientRect() ?? { top: 0, bottom: 0, left: 0, right: 0 }
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
