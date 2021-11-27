import { v4 as uuid } from 'uuid'
import { finder } from '@medv/finder'

import {
  EVENT_INTERCEPTED,
  HIGHLIGHT_ELEMENT,
} from '../globalConstants/messageTypes'

const extensionId =
  (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
    ?.extid ?? ''

const alreadyInterceptedSymbol = Symbol('alreadyInterceptedSymbol')

let highLightElement: HTMLDivElement | null = null

window.addEventListener('message', ({ data }) => {
  if (data.type === HIGHLIGHT_ELEMENT) {
    const selector: string = data.selector
    if (!highLightElement && selector) {
      const el = document.createElement('div')
      el.style.position = 'fixed'
      el.style.backgroundColor = '#0080ff'
      el.style.opacity = '0.5'
      el.style.display = 'none'
      el.style.border = '1px dashed gold'

      document.body.append(el)
      highLightElement = el
    }

    if (!highLightElement) {
      return
    }

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
  if (event[alreadyInterceptedSymbol]) {
    return
  }

  event[alreadyInterceptedSymbol] = true

  const {
    target,
    type,
    altKey, // mouse and keyboard
    animationName, // animation
    bubbles, // can bubble or not
    button, // which button was pressed
    buttons, // which buttons were pressed
    cancelable,
    charCode, // keyboard
    clientX, // mouse
    clientY, // mouse
    code, // keyboard
    ctrlKey, // mouse and keyboard
    data, // input events
    deltaX, // scroll
    deltaY, // scroll
    deltaZ, // scroll
    deltaMode, // scroll
    detail,
    elapsedTime, // animation
    eventPhase,
    inputType,
    isTrusted, // is invoked by user
    key, // keyboard
    keyCode, // keyboard
    location, // keyboard
    metaKey, // mouse and keyboard
    newURL, // hash change
    oldURL, // hash change
    pageX,
    pageY,
    persisted, // is loaded from cache
    propertyName, // css prop in transition
    // relatedTarget, // related element for mouse
    screenX, // mouse
    screenY, // mouse
    shiftKey, // keyboard
    defaultPrevented,
    //targetTouches, // all target's for touch event
    timeStamp, // ms since document loaded
    touches,
    which, // mouse button
  } = event

  try {
    const role = target?.attributes?.role?.value
    const ariaLabel = target?.ariaLabel
    const placeholder = target?.attributes?.placeholder?.value
    const textContent = target?.outerText
    const className = target?.attributes?.class?.value
    const elementId = target?.attributes?.id?.value
    const testId = target?.attributes?.['data-testid']?.value
    const uniqueSelector = finder(target)

    const selectors = [
      ariaLabel && role && { name: 'role', ariaLabel, value: role },
      ariaLabel && { name: 'label-text', value: ariaLabel },
      placeholder && { name: 'placeholder', value: placeholder },
      textContent && { name: 'text', value: textContent },
      className && { name: 'classname', value: className },
      elementId && { name: 'element-id', value: elementId },
      testId && { name: 'test-id', value: testId },
      { name: 'unique-path', value: uniqueSelector },
    ].filter((sel) => !!sel)

    const validSelectors = selectors.filter((item) => item.value)

    const message = {
      id: extensionId,
      type: EVENT_INTERCEPTED,
      payload: {
        id: uuid(),
        validSelectors,
        triggeredAt: Date.now(),
        selector: uniqueSelector,
        selectedSelector: validSelectors[0],
        type,
        altKey,
        animationName,
        bubbles,
        button,
        buttons,
        cancelable,
        charCode,
        clientX,
        clientY,
        code,
        ctrlKey,
        data,
        deltaX,
        deltaY,
        deltaZ,
        deltaMode,
        detail,
        elapsedTime,
        eventPhase,
        inputType,
        isTrusted,
        key,
        keyCode,
        location,
        metaKey,
        newURL,
        oldURL,
        pageX,
        pageY,
        persisted,
        propertyName,
        screenX,
        screenY,
        shiftKey,
        defaultPrevented,
        timeStamp,
        touches,
        which,
      },
    }
    window.postMessage(message)
  } catch (error) {
    console.log('Error sending recorded event:', error, type, target)
  }
}
