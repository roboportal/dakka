import { createSelector } from '@reduxjs/toolkit'
import {
  EventRecorderState,
  IEventBlock,
  IEventPayload,
} from 'store/eventRecorderSlice'
import { SLICE_NAMES, RootState } from './index'
import { assertionTypes } from 'constants/assertion'
import { WAIT_FOR_ELEMENT, ASSERTION } from '../constants/actionTypes'

const EVENT_TYPES_TO_IGNORE_ELEMENT_SELECT = [
  assertionTypes.notToHaveTitle,
  assertionTypes.notToHaveURL,
  assertionTypes.toHaveTitle,
  assertionTypes.toHaveURL,
]

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
    isError: !e.assertionValue || !e.assertionAttribute,
    areFieldsValid: {
      assertionValue: !e.assertionValue,
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

  [assertionTypes.hasAttribute]: validateNonEmptyAttributeAndValue,
  [assertionTypes.notHasAttribute]: validateNonEmptyAttributeAndValue,

  [assertionTypes.toHaveTitle]: validateNonEmptyValue,
  [assertionTypes.notToHaveTitle]: validateNonEmptyValue,

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
  (state: IEventPayload[]) => state.every((it) => !it.isInvalidValidSetUp),
)

export const getIsManualEventInsert = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.isManualEventInsert,
)

export const getExpandedEventId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.expandedId,
)
