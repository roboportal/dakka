const checkbox = document.querySelector('input[type=checkbox]')
const testButton = document.querySelector('button')
const textInput = document.querySelector('input[type=text]')

setTimeout(() => {
  const handler = () => console.log('test')
  const handler1 = () => console.log('test1')
  checkbox?.addEventListener('change', () => {
    if ((checkbox as HTMLInputElement).checked) {
      testButton?.addEventListener('click', handler)

      // testButton?.addEventListener('dblclick', handler)
      testButton?.addEventListener('click', handler1)
    } else {
      testButton?.removeEventListener('click', handler)
      testButton?.removeEventListener('click', handler1)
    }
  })
  // textInput?.addEventListener('keypress', console.log)
  // textInput?.addEventListener('keydown', console.log)
  // textInput?.addEventListener('keyup', console.log)
  textInput?.addEventListener('input', console.log)
}, 0)
