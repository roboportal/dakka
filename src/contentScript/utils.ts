import { v4 as uuid } from 'uuid'
import { finder } from '@medv/finder'

import {
  EVENT_INTERCEPTED,
  ENABLE_RECORDER,
  HIGHLIGHT_ELEMENT,
} from '../constants/messageTypes'

export const shouldProcessMessage = (type: string) =>
  [ENABLE_RECORDER, HIGHLIGHT_ELEMENT].includes(type)

export class HandlersCache {
  storage: Map<
    EventListenerOrEventListenerObject,
    { event: EventListenerOrEventListenerObject; count: number }
  >

  constructor() {
    this.storage = new Map()
  }

  set(
    handler: EventListenerOrEventListenerObject,
    event: EventListenerOrEventListenerObject,
  ) {
    const v = this.storage.get(handler) ?? { event, count: 0 }
    v.count++
    this.storage.set(handler, v)
  }

  get(
    handler: EventListenerOrEventListenerObject,
  ): EventListenerOrEventListenerObject | undefined {
    const v = this.storage.get(handler)

    if (!v) {
      return
    }
    v.count--
    if (v.count === 0) {
      this.storage.delete(handler)
    }
    return v.event
  }
}

const id =
  (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
    ?.extid ?? ''

export function eventHandler(event: any) {
  try {
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

    const role = target?.attributes?.role?.value
    const ariaLabel = target?.ariaLabel
    const placeholder = target?.attributes?.placeholder?.value
    const textContent = target?.outerText
    const className = target?.attributes?.class?.value
    const elementId = target?.attributes?.id?.value
    const testId = target?.attributes?.['data-testid']?.value

    const selectors = [
      ...[ariaLabel ? { name: 'role', ariaLabel, value: role } : {}],
      { name: 'label-text', value: ariaLabel },
      { name: 'placeholder', value: placeholder },
      { name: 'text', value: textContent },
      { name: 'classname', value: className },
      { name: 'element-id', value: elementId },
      { name: 'test-id', value: testId },
      { name: 'unique-path', value: finder(target) },
    ]

    const validSelectors = selectors.filter((item) => item.value)

    const message = {
      id,
      type: EVENT_INTERCEPTED,
      payload: {
        id: uuid(),
        validSelectors,
        triggeredAt: Date.now(),
        selector: finder(target),
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
  } catch {}
}
