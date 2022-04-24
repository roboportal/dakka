import { nanoid } from 'nanoid'
import { createSlice, PayloadAction, original } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { INTERACTIVE_ELEMENT, ELEMENT_SELECTED } from '@/constants/messageTypes'
import { eventsToTrack } from '@/constants/eventTypes'
import { process } from './utils/eventProcessor'
import { exportOptions } from './utils/constants'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Record<string, IEventBlock[]>>
  isManualEventInsert: boolean
  allowedInjections: Record<number, boolean>
  activeBlockId: string | null
  expandedId: string | null
  lastSelectedEventId: string
  exportType: exportOptions
  testCases: Record<string, ITestCase>
  firstEventRecorded: boolean
}

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
  exportType: exportOptions.none,
  testCases: {},
  firstEventRecorded: false,
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
    setActiveTabID: (state, { payload }: PayloadAction<number>) => {
      const id = nanoid()
      state.activeTabID = payload
      if (!state.events[payload]) {
        state.events[payload] = { [id]: [] }
      }
      if (!state.testCases[payload]) {
        state.testCases[payload] = {
          selectedItId: id,
          describe: '',
          its: [
            {
              id,
              value: '',
            },
          ],
        }
      }
    },

    toggleIsRecorderEnabled: (state) => {
      state.isRecorderEnabled = !state.isRecorderEnabled
    },

    recordEvent: (
      state,
      { payload: { tabId, eventRecord } }: PayloadAction<IRecordEventPayload>,
    ) => {
      const { events, isRecorderEnabled, activeBlockId, testCases } = state
      const { selectedItId } = testCases[tabId]

      if (eventRecord?.type === ELEMENT_SELECTED && activeBlockId) {
        const block = events[tabId][selectedItId].find(
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

      state.firstEventRecorded = true

      process(events[tabId][selectedItId] as IEventBlock[], eventRecord.payload)

      state.isManualEventInsert = false
    },

    clearEvents: (state, { payload: { tabId } }) => {
      const { selectedItId } = state.testCases[tabId]
      state.events[tabId][selectedItId] = []
    },

    selectEventSelector: (
      { events, testCases },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const { selectedItId } = testCases[tabId]
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

      events[tabId][selectedItId].forEach((e) =>
        updateSelector(e as WritableDraft<IEventBlock>),
      )
    },

    selectIframeEventSelector: (
      { events, testCases },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const { selectedItId } = testCases[tabId]
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
      events[tabId][selectedItId].forEach((e) =>
        updateSelector(e as WritableDraft<IEventBlock>),
      )
    },

    setActiveBlockId: (state, { payload }: PayloadAction<string>) => {
      state.activeBlockId = payload
    },

    setCustomAssertSelector: (
      { events, activeTabID, testCases },
      {
        payload: { blockId, selector },
      }: PayloadAction<{ blockId: string; selector: string }>,
    ) => {
      const { selectedItId } = testCases[activeTabID]
      const block = events[activeTabID][selectedItId].find(
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
      { events, testCases, activeTabID },
      { payload }: PayloadAction<IAssertionPayload>,
    ) => {
      const { selectedItId } = testCases[activeTabID]
      const { recordId, assertionType, assertionAttribute, assertionValue } =
        payload
      const block = events[activeTabID][selectedItId].find(
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
      const { selectedItId } = state.testCases[tabId]
      const [first, second] = eventIds
      if (Array.isArray(state.events[tabId][first])) {
        const it = state.events[tabId][first] as unknown as WritableDraft<
          IEventBlock[]
        >
        it.splice(second, 1)
        if (it.length === 1) {
          state.events[tabId][selectedItId][first] = it[0]
        }
        if (it.length === 0) {
          state.events[tabId][selectedItId].splice(first, 1)
        }
      } else {
        state.events[tabId][selectedItId].splice(first, 1)
      }
    },

    insertBlock: (state, { payload: { type, eventIndex, triggeredAt } }) => {
      const tabId = state.activeTabID
      const { selectedItId } = state.testCases[tabId]
      const index = eventIndex + 1

      const lastRedirect = [
        ...(original(state.events[tabId][selectedItId]) ?? []),
      ]
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

      state.events[tabId][selectedItId].splice(index, 0, block)

      const shouldPreventAutoScroll =
        index !== state.events[tabId][selectedItId].length - 1

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

    setExportType: (state, { payload }: PayloadAction<exportOptions>) => {
      state.exportType = payload
    },

    addItToTestCase: ({ events, activeTabID, testCases }) => {
      const length = testCases[activeTabID]?.its?.length
      const id = nanoid()
      testCases[activeTabID].its.push({
        id,
        value: '',
      })
      if (length === 0) {
        testCases[activeTabID].selectedItId = id
      }
      events[activeTabID][id] = []
    },

    removeItFromTestCase: (
      { events, activeTabID, testCases },
      { payload }: PayloadAction<string>,
    ) => {
      const index = testCases[activeTabID].its.findIndex(
        (it) => it.id === payload,
      )
      const isRemovedSelected = testCases[activeTabID].selectedItId === payload

      testCases[activeTabID].its.splice(index, 1)

      if (isRemovedSelected && testCases[activeTabID].its.length >= 1) {
        testCases[activeTabID].selectedItId = testCases[activeTabID].its[0].id
      }

      delete events[activeTabID][payload]
    },

    selectIt: (
      { activeTabID, testCases },
      { payload }: PayloadAction<string>,
    ) => {
      testCases[activeTabID].selectedItId = payload
    },

    changeDescribe: (
      { activeTabID, testCases },
      { payload }: PayloadAction<string>,
    ) => {
      testCases[activeTabID].describe = payload
    },

    changeIt: (
      { activeTabID, testCases },
      { payload: { id, value } }: PayloadAction<{ id: string; value: string }>,
    ) => {
      testCases[activeTabID].its.forEach((it) => {
        if (it.id === id) {
          it.value = value
        }
      })
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
  setExportType,
  addItToTestCase,
  removeItFromTestCase,
  selectIt,
  changeDescribe,
  changeIt,
} = eventRecorderSlice.actions

export default eventRecorderSlice.reducer
