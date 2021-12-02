export const UTILITY_KEYS = [
  'Tab',
  'CapsLock',
  'Shift',
  'Control',
  'Alt',
  'Meta',

  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',

  'Left',
  'Right',
  'Up',
  'Down',

  'Enter',
  'Backspace',
  'Delete',

  'Esc',
  'Escape',

  'Pause',
  'PageUp',
  'PageDown',
  'End',
  'Home',
  'PrintScreen',
  'Insert',
  'ContextMenu',
  'NumLock',
  'ScrollLock',
  'AudioVolumeMute',
  'AudioVolumeDown',
  'AudioVolumeUp',
  'LaunchMediaPlayer',
  'LaunchApplication1',
  'LaunchApplication2',

  ...Array(12)
    .fill(null)
    .map((_, index) => `F${index + 1}`),
]
