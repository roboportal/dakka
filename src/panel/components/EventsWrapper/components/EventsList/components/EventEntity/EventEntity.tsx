import { css } from '@emotion/react'
import { lightBlue, indigo } from '@mui/material/colors'

import { IEventBlock } from 'store/eventRecorderSlice'

import useEventEntity from 'hooks/useEventEntity'

import { ASSERTION } from 'constants/actionTypes'
import { INTERACTIVE_ELEMENT } from 'constants/messageTypes'
import { AssertionSelector } from './components/AssertionSelector'
import { EntryRow } from './components/EntryRow'
import { Actions } from './components/Actions'
import { DeleteAction } from './components/DeleteAction'
import { truncate } from 'utils/string'

function getBackgroundColor({
  isHover,
  isRedirect,
  prefersDarkMode,
}: {
  isRedirect: boolean
  prefersDarkMode: boolean
  isHover?: boolean
}) {
  if (!prefersDarkMode && isHover && !isRedirect) {
    return 'black'
  }

  if (prefersDarkMode) {
    return isRedirect ? indigo[900] : lightBlue[900]
  }

  return isRedirect ? 'rgb(26, 32, 39)' : 'rgb(0, 30, 60)'
}

interface EventEntityProps {
  record: IEventBlock
  index: string
  isExpanded: boolean
  prefersDarkMode: boolean
  isFirstEntity: boolean
}

export function EventEntity({
  record,
  index,
  isExpanded,
  prefersDarkMode,
  isFirstEntity,
}: EventEntityProps) {
  const {
    shouldHaveTopMargin,
    isRedirect,
    isAddCustomSelector,
    isSelectElement,
    handleSelectElement,
    handleExpand,
    handleOnClickAddSelector,
    isManualSelectorSetupVisible,
    type,
    key,
    handleAddCustomSelector,
    interactiveElementLabel,
    interactiveElementSelectorValue,
    url,
    selector,
    isResize,
  } = useEventEntity(record, isExpanded)

  return (
    <div
      data-event_list_index={index}
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        padding: 4px 4px 0px 4px;
        font-size: 0.8rem;
        margin-bottom: 4px;
        border: 1px solid;
        ${shouldHaveTopMargin ? 'margin-top: 28px;' : ''}
        background-color: ${getBackgroundColor({
          isRedirect,
          prefersDarkMode,
        })};
        :hover {
          background-color: ${getBackgroundColor({
            isRedirect,
            prefersDarkMode,
            isHover: true,
          })};
        }
      `}
    >
      <Actions
        isAddCustomSelector={isAddCustomSelector}
        isSelectElement={isSelectElement}
        prefersDarkMode={prefersDarkMode}
        isExpanded={isExpanded}
        isInteractive={record.variant === INTERACTIVE_ELEMENT}
        onSelectElement={handleSelectElement}
        onExpand={handleExpand}
        onAddCustomSelector={handleOnClickAddSelector}
        isIncompleteSetup={record.isInvalidValidSetUp ?? false}
        areElementsSelectorsVisible={record?.shouldUseElementSelector ?? true}
        isManualSelectorSetupVisible={isManualSelectorSetupVisible}
      />

      <div
        css={css`
          pointer-events: ${isExpanded ? 'auto' : 'none'};
          display: grid;
          flex-grow: 1;
          overflow: ${isExpanded ? 'scroll' : 'hidden'};
          height: calc(100vh - 52px - 68px);
        `}
      >
        <EntryRow
          label="Event"
          value={type}
          prefersDarkMode={prefersDarkMode}
        />
        {key && (
          <EntryRow
            prefersDarkMode={prefersDarkMode}
            isExpanded={isExpanded}
            label="Key"
            value={truncate(key, 7, isExpanded)}
          />
        )}

        {record.variant === INTERACTIVE_ELEMENT && !isResize && (
          <EntryRow
            record={record}
            isAddCustomSelector={isAddCustomSelector}
            onAddCustomSelector={handleAddCustomSelector}
            prefersDarkMode={prefersDarkMode}
            isLast={true}
            isExpanded={isExpanded}
            label={interactiveElementLabel}
            value={interactiveElementSelectorValue}
          />
        )}

        {record.variant !== INTERACTIVE_ELEMENT && !isResize && (
          <EntryRow
            prefersDarkMode={prefersDarkMode}
            isLast={true}
            isDividerVisible={!isFirstEntity}
            isExpanded={isExpanded}
            label={isRedirect ? 'URL' : 'Selector'}
            value={
              isRedirect
                ? truncate(url, 9, isExpanded)
                : truncate(selector, 9, isExpanded)
            }
          />
        )}

        {isResize && (
          <>
            <EntryRow
              prefersDarkMode={prefersDarkMode}
              isDividerVisible={!isFirstEntity}
              isExpanded={isExpanded}
              label="width"
              value={(record.innerWidth ?? '').toString()}
            />
            <EntryRow
              prefersDarkMode={prefersDarkMode}
              isDividerVisible={!isFirstEntity}
              isExpanded={isExpanded}
              label="height"
              value={(record.innerHeight ?? '').toString()}
            />
          </>
        )}

        {record.type === ASSERTION && (
          <AssertionSelector
            isExpanded={isExpanded}
            record={record}
            prefersDarkMode={prefersDarkMode}
          />
        )}
      </div>
      {!isFirstEntity && <DeleteAction index={index} />}
    </div>
  )
}
