const frameButton = document.querySelector('#button')
const frameInput = document.querySelector('#text')
const frameFile = document.querySelector('#file')
const frameTextResult = document.querySelector('#text_result')
const frameFileSelectResult = document.querySelector('#file_select_result')

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

frameFile?.addEventListener('change', (e) => {
  const [{ name }] = (e?.target as any).files
  if (frameFileSelectResult) {
    frameFileSelectResult.textContent = name
  }
})
