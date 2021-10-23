const checkbox = document.querySelector('input[type=checkbox]')
const testButton = document.querySelector('button')

setTimeout(() => {
  const handler = () => console.log('test')
  checkbox?.addEventListener('change', () => {
    if ((checkbox as HTMLInputElement).checked) {
      testButton?.addEventListener('click', handler)
    } else {
      testButton?.removeEventListener('click', handler)
    }
  })
}, 0)
