const frameButton = document.querySelector('#button')
const frameInput = document.querySelector('#text')
const frameTextResult = document.querySelector('#text_result')

frameButton?.addEventListener('click', () => {
  if (frameButton) {
    frameButton.textContent = 'Clicked'
  }
})

frameInput?.addEventListener('input', (e) => {
  if (frameTextResult) {
    frameTextResult.textContent = (e?.target as any)?.value
  }
})
