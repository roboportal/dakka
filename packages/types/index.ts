interface IIt {
  id: string
  value: string
  selected?: boolean
  isValidSetup?: boolean
}

export interface ITestCase {
  describe: string
  selectedItId: string
  its: IIt[]
}

export interface ISelector {
  name: string
  value: string
  ariaLabel?: string
  length: number
  priority: number
  closest?: number
  tagName?: string
}

export interface IEventBlock {
  type: string
  id: string
  element?: IEventBlock | null
  assertionAttribute?: string
  assertionValue?: string
  assertionType?: Record<string, string>
  assertionInputsValidationResult?: Record<string, boolean>
  selector: string
  triggeredAt: number
  validSelectors?: ISelector[]
  selectedSelector?: ISelector
  url?: string
  variant: string
  key?: string
  data?: string
  repeat?: boolean
  composedEvents?: IEventBlock[]
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  inputType?: string
  isInjectingAllowed?: boolean
  isInvalidValidSetUp?: boolean
  shouldUseElementSelector?: boolean
  title?: string
  text?: string
  attributesMap?: Record<string, string>
  innerHeight?: number
  innerWidth?: number
  isInIframe?: boolean
  selectedIframeSelector?: ISelector
  iframeDetails?: {
    selectors: ISelector[]
    selector: string
  }
  files?: Array<{
    lastModified: number
    name: string
    size: number
    type: string
  }>
}
