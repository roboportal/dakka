const checkbox = document.querySelector('#checkbox')
const button = document.querySelector('#button')
const input = document.querySelector('#text')
const textResult = document.querySelector('#text_result')
const checkboxResult = document.querySelector('#checkbox_result')

button?.addEventListener('click', () => {
  if (button) {
    button.textContent = 'Clicked'
  }
})

let checked = false

checkbox?.addEventListener('click', () => {
  checked = !checked
  if (checkboxResult) {
    checkboxResult.textContent = checked ? 'checked' : 'unchecked'
  }
})

input?.addEventListener('input', (e) => {
  if (textResult) {
    textResult.textContent = (e?.target as any)?.value
  }
})
