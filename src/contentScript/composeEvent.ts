import { nanoid } from 'nanoid'
import { finder } from '@medv/finder'

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

  const role = target?.attributes?.role?.value
  const ariaLabel = target?.ariaLabel
  const placeholder = target?.attributes?.placeholder?.value
  const textContent = target?.outerText
  const className = target?.attributes?.class?.value
  const elementId = target?.attributes?.id?.value
  const testId = target?.attributes?.['data-testid']?.value

  if (!(target instanceof Element)) {
    return {}
  }

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
    },
  }
}
