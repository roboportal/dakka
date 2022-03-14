import { nanoid } from 'nanoid'

import { createSlice, PayloadAction, original } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'

import { INTERACTIVE_ELEMENT, ELEMENT_SELECTED } from '@/constants/messageTypes'
import { eventsToTrack } from '@/constants/eventTypes'
import { process } from './utils/eventProcessor'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, IEventBlock[]>
  isManualEventInsert: boolean
  allowedInjections: Record<number, boolean>
  activeBlockId: string | null
  expandedId: string | null
  lastSelectedEventId: string
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

export interface IAssertionPayload {
  recordId: string
  assertionValue?: string
  assertionType?: Record<string, string>
  assertionAttribute?: string
  customSelector?: string
}

export interface ISelectorPayload {
  selectedSelector: ISelector
  record: IEventBlock
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
}

export interface IEventBlockPayload {
  type: string
  eventIndex: number
}

export interface IEventRecord {
  id: string
  type: string
  payload: IEventBlock
}

export interface IRecordEventPayload {
  tabId: number
  eventRecord: IEventRecord
}

const initialState: EventRecorderState = {
  isRecorderEnabled: false,
  activeTabID: -1,
  events: {},
  isManualEventInsert: false,
  allowedInjections: {},
  activeBlockId: null,
  expandedId: null,
  lastSelectedEventId: '',
}

const areEventsIframeSelectorsEqual = (
  record: WritableDraft<IEventBlock>,
  eventRecord: WritableDraft<IEventBlock>,
) => {
  const existingIframeSelector =
    (eventRecord as WritableDraft<IEventBlock>).element?.iframeDetails
      ?.selector ??
    (eventRecord as WritableDraft<IEventBlock>)?.iframeDetails?.selector

  const incomingIframeSelector =
    (record as WritableDraft<IEventBlock>).element?.iframeDetails?.selector ??
    (record as WritableDraft<IEventBlock>)?.iframeDetails?.selector

  return existingIframeSelector === incomingIframeSelector
}

export const eventRecorderSlice = createSlice({
  name: 'eventRecorder',
  initialState,
  reducers: {
    setActiveTabID: (state, action: PayloadAction<number>) => {
      state.activeTabID = action.payload
    },
    toggleIsRecorderEnabled: (state) => {
      state.isRecorderEnabled = !state.isRecorderEnabled
    },
    recordEvent: (
      state,
      { payload: { tabId, eventRecord } }: PayloadAction<IRecordEventPayload>,
    ) => {
      const { events, isRecorderEnabled, activeBlockId } = state

      if (eventRecord?.type === ELEMENT_SELECTED && activeBlockId) {
        const block = events[tabId].find(
          (item) => item.id === activeBlockId,
        ) as IEventBlock

        block.element = eventRecord.payload
        state.activeBlockId = null
        return state
      }

      if (!isRecorderEnabled) {
        return state
      }

      const hasInValidTabIdOrEventShouldNotBeRecorded =
        tabId < 0 || !eventsToTrack[eventRecord?.payload?.type]

      if (hasInValidTabIdOrEventShouldNotBeRecorded) {
        return state
      }

      const isFirstEventRecordedForTab = !events[tabId] || !events[tabId].length

      if (isFirstEventRecordedForTab) {
        events[tabId] = []
      }

      process(events[tabId] as IEventBlock[], eventRecord.payload)

      state.isManualEventInsert = false
    },
    clearEvents: (state, { payload: { tabId } }) => {
      state.events[tabId] = []
    },
    selectEventSelector: (
      { events },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const updateSelector = (
        eventRecord: WritableDraft<IEventBlock | IEventBlock>,
      ) => {
        if (!areEventsIframeSelectorsEqual(record, eventRecord)) {
          return
        }

        const existingSelector =
          (eventRecord as WritableDraft<IEventBlock>).element?.selector ??
          (eventRecord as WritableDraft<IEventBlock>)?.selector

        const incomingSelector =
          (record as WritableDraft<IEventBlock>).element?.selector ??
          (record as WritableDraft<IEventBlock>)?.selector

        if (incomingSelector === existingSelector) {
          if (eventRecord.variant === INTERACTIVE_ELEMENT) {
            const element = (eventRecord as WritableDraft<IEventBlock>).element
            if (element) {
              element.selectedSelector = selectedSelector
            }
            return
          }

          ;(eventRecord as WritableDraft<IEventBlock>).selectedSelector =
            selectedSelector
        }
      }

      events[tabId].forEach((e) =>
        updateSelector(e as WritableDraft<IEventBlock>),
      )
    },

    selectIframeEventSelector: (
      { events },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const updateSelector = (
        eventRecord: WritableDraft<IEventBlock | IEventBlock>,
      ) => {
        if (areEventsIframeSelectorsEqual(record, eventRecord)) {
          if (eventRecord.variant === INTERACTIVE_ELEMENT) {
            const element = (eventRecord as WritableDraft<IEventBlock>).element
            if (element) {
              element.selectedIframeSelector = selectedSelector
            }
            return
          }

          ;(eventRecord as WritableDraft<IEventBlock>).selectedIframeSelector =
            selectedSelector
        }
      }
      events[tabId].forEach((e) =>
        updateSelector(e as WritableDraft<IEventBlock>),
      )
    },

    setActiveBlockId: (state, { payload }: PayloadAction<string>) => {
      state.activeBlockId = payload
    },
    setCustomAssertSelector: (
      state,
      {
        payload: { blockId, selector },
      }: PayloadAction<{ blockId: string; selector: string }>,
    ) => {
      const block = state.events[state.activeTabID].find(
        (item) => item.id === blockId,
      )

      if (block) {
        block.element = {
          selectedSelector: selector
            ? { name: 'unique-path', value: selector, length: 0, priority: 3 }
            : undefined,
          validSelectors: [],
          selector: '',
          id: '',
          type: '',
          triggeredAt: 0,
          variant: '',
        }
      }
    },
    setExpandedId: (state, { payload }: PayloadAction<string>) => {
      state.expandedId = payload
    },
    setAssertionProperties: (
      state,
      { payload }: PayloadAction<IAssertionPayload>,
    ) => {
      const { recordId, assertionType, assertionAttribute, assertionValue } =
        payload
      const block = state.events[state.activeTabID].find(
        (item) => item.id === recordId,
      ) as IEventBlock

      if (assertionAttribute !== undefined) {
        block.assertionAttribute = assertionAttribute
      }

      if (assertionValue !== undefined) {
        block.assertionValue = assertionValue
      }

      if (assertionType !== undefined) {
        block.assertionType = assertionType
      }
    },
    removeEvent: (
      state,
      { payload: { eventIds } }: PayloadAction<{ eventIds: number[] }>,
    ) => {
      const tabId = state.activeTabID
      const [first, second] = eventIds
      if (Array.isArray(state.events[tabId][first])) {
        const it = state.events[tabId][first] as unknown as WritableDraft<
          IEventBlock[]
        >
        it.splice(second, 1)
        if (it.length === 1) {
          state.events[tabId][first] = it[0]
        }
        if (it.length === 0) {
          state.events[tabId].splice(first, 1)
        }
      } else {
        state.events[tabId].splice(first, 1)
      }
    },
    insertBlock: (state, { payload: { type, eventIndex, triggeredAt } }) => {
      const tabId = state.activeTabID
      const index = eventIndex + 1

      const lastRedirect = [...(original(state.events[tabId]) ?? [])]
        .reverse()
        .find((e) => e.type === '_redirect')

      const block = {
        id: nanoid(),
        eventRecordIndex: index,
        type,
        url: lastRedirect?.url ?? '',
        title: lastRedirect?.title ?? '',
        variant: INTERACTIVE_ELEMENT,
        triggeredAt,
        element: null,
        selector: '',
      } as WritableDraft<IEventBlock>

      state.events[tabId].splice(index, 0, block)

      const shouldPreventAutoScroll = index !== state.events[tabId].length - 1

      state.isManualEventInsert = shouldPreventAutoScroll
    },

    setIsInjectionAllowed: (
      state,
      { payload: { tabId, isInjectingAllowed } },
    ) => {
      state.allowedInjections[tabId] = isInjectingAllowed
    },

    setLastSelectedEventId: (state, { payload }) => {
      state.lastSelectedEventId = payload
    },
  },
})

export const {
  selectEventSelector,
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  removeEvent,
  insertBlock,
  setIsInjectionAllowed,
  setActiveBlockId,
  setExpandedId,
  setAssertionProperties,
  setCustomAssertSelector,
  setLastSelectedEventId,
  selectIframeEventSelector,
} = eventRecorderSlice.actions

export default eventRecorderSlice.reducer
