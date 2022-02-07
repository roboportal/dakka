import { nanoid } from 'nanoid'
import { finder } from '@medv/finder'
import { generateSelectors } from './genarateSelector'

export function composeEvent({
  event,
  extensionId,
  eventType,
}: {
  event: any
  extensionId: string
  eventType: string
}) {
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
    repeat, //keyboard
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

  const computedStyles =
    target instanceof Element && window.getComputedStyle(target)
  const isHidden =
    (computedStyles as CSSStyleDeclaration)?.visibility === 'hidden' ||
    target?.style?.visibility === 'hidden'

  const isDisplayNone =
    (computedStyles as CSSStyleDeclaration)?.display === 'none' ||
    target?.style?.display === 'none'

  if (!(target instanceof Element) || isHidden || isDisplayNone) {
    return {}
  }

  const tagName = (target?.tagName ?? '').toLowerCase()
  const uniqueSelector = finder(target)
  const validSelectors = generateSelectors(target, { uniqueSelector, tagName })

  return {
    id: extensionId,
    type: eventType,
    payload: {
      id: nanoid(),
      validSelectors,
      triggeredAt: Date.now(),
      selector: uniqueSelector,
      selectedSelector: validSelectors[0],
      url: window.location.href,
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
      repeat,
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
      tagName: tagName ?? '*',
    },
  }
}
