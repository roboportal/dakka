export type ControlPanelProps = {
  isRecorderEnabled: boolean
  isSettingsButtonActive: boolean
  onRecordEnabledChange: () => void
  onClearEventsByTabId: () => void
  onSettingsClick: () => void
  onAutoScrollToggle: () => void
  isAutoScrollEnabled: boolean
}
