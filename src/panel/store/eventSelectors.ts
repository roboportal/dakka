import { createSelector } from '@reduxjs/toolkit'
import { EventRecorderState, IEventBlock } from '@/store/eventRecorderSlice'
import { SLICE_NAMES, RootState } from './index'
import { assertionTypes } from '@/constants/assertion'
import { WAIT_FOR_ELEMENT, ASSERTION } from '../constants/actionTypes'

const EVENT_TYPES_TO_IGNORE_ELEMENT_SELECT = [
  assertionTypes.notToHaveTitle,
  assertionTypes.notToHaveURL,
  assertionTypes.toHaveTitle,
  assertionTypes.toHaveURL,
]

const validateString = (e: IEventBlock) => {
  return {
    isError: typeof e.assertionValue !== 'string',
    areFieldsValid: {
      assertionValue: typeof e.assertionValue !== 'string',
    },
  }
}

const validateNonEmptyValue = (e: IEventBlock) => {
  return {
    isError: !e.assertionValue,
    areFieldsValid: {
      assertionValue: !e.assertionValue,
    },
  }
}

const validateNumericValue = (e: IEventBlock) => {
  const isNotNumber =
    e.assertionValue === '' || !Number.isFinite(+(e.assertionValue ?? ''))
  return {
    isError: isNotNumber,
    areFieldsValid: {
      assertionValue: isNotNumber,
    },
  }
}

const validateNonEmptyAttributeAndValue = (e: IEventBlock) => {
  return {
    isError: typeof e.assertionValue !== 'string' || !e.assertionAttribute,
    areFieldsValid: {
      assertionValue: typeof e.assertionValue !== 'string',
      assertionAttribute: !e.assertionAttribute,
    },
  }
}

const assertionValidatorsMap: Record<
  string,
  (e: IEventBlock) => {
    isError: boolean
    areFieldsValid?: Record<string, boolean>
  }
> = {
  [assertionTypes.contains]: validateNonEmptyValue,
  [assertionTypes.notContains]: validateNonEmptyValue,

  [assertionTypes.equals]: validateNonEmptyValue,
  [assertionTypes.notEquals]: validateNonEmptyValue,

  [assertionTypes.hasAttribute]: validateNonEmptyAttributeAndValue,
  [assertionTypes.notHasAttribute]: validateNonEmptyAttributeAndValue,

  [assertionTypes.toHaveTitle]: validateString,
  [assertionTypes.notToHaveTitle]: validateString,

  [assertionTypes.toHaveURL]: validateNonEmptyValue,
  [assertionTypes.notToHaveURL]: validateNonEmptyValue,

  [assertionTypes.toHaveLength]: validateNumericValue,
  [assertionTypes.notToHaveLength]: validateNumericValue,

  default: () => ({
    isError: false,
  }),
}

export const getIsRecorderEnabled = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.isRecorderEnabled,
)

export const getActiveBlockId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.activeBlockId,
)

export const getActiveEvents = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state: EventRecorderState) =>
    (state.events[state.activeTabID] ?? []).map((e) => {
      const { type, element, assertionType } = e as IEventBlock

      if (type === WAIT_FOR_ELEMENT) {
        const isInvalidValidSetUp = !element
        return { ...e, isInvalidValidSetUp }
      }

      if (type === ASSERTION) {
        const r = e as IEventBlock

        const shouldUseElementSelector =
          !EVENT_TYPES_TO_IGNORE_ELEMENT_SELECT.includes(
            assertionType?.type as assertionTypes,
          )

        const validationResult =
          assertionValidatorsMap?.[assertionType?.type ?? '']?.(r) ??
          assertionValidatorsMap.default(r)

        const isElementSelected = !!(element && element.selectedSelector)
        const areInputsInvalid = validationResult?.isError
        const isAssertionTypeSelected = assertionType?.type

        const isInvalidValidSetUp =
          (shouldUseElementSelector && !isElementSelected) ||
          areInputsInvalid ||
          !isAssertionTypeSelected

        return {
          ...e,
          isInvalidValidSetUp,
          shouldUseElementSelector,
          assertionInputsValidationResult: validationResult.areFieldsValid,
        }
      }

      return e
    }),
)

export const getIsReadyToExport = createSelector(
  getActiveEvents,
  (state: IEventBlock[]) => state.every((it) => !it.isInvalidValidSetUp),
)

export const getIsManualEventInsert = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.isManualEventInsert,
)

export const getExpandedEventId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.expandedId,
)

export const getActiveTabId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.activeTabID,
)

export const getLastSelectedEventId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.lastSelectedEventId,
)

export const getEvents = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.events,
)

export const getAllowedInjections = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.allowedInjections,
)

export const getExportType = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.exportType,
)

export const getActiveTestCase = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.testCases[state.activeTabID],
)
