import { memo } from 'react'
import { css } from '@emotion/react'
import { useSelector } from 'react-redux'

import { getActiveEvents } from '@/store/eventSelectors'
import { getExpandedEventId } from '@/store/eventSelectors'

import { Record } from './components/Record/Record'
import { EventEntity } from './components/EventEntity/EventEntity'
import { Selector } from './components/Selector/Selector'
import { assertionTypes } from '@/constants/assertion'

const DEFAULT_WIDTH = '88px'
const EXPANDED_WIDTH = '340px'

interface IEventsListProps {
  setDragOverIndex: (value: number) => void
  dragOverIndex: number
  prefersDarkMode: boolean
}

function EventsList({
  setDragOverIndex,
  dragOverIndex,
  prefersDarkMode,
}: IEventsListProps) {
  const expandedId = useSelector(getExpandedEventId)
  const events = useSelector(getActiveEvents)

  if (!events) {
    return null
  }

  return (
    <>
      {events?.map((record, index) => {
        const isExpanded = expandedId === record.id
        const isFirstEvent = index === 0
        const hasIframeSelector =
          (!!record?.selectedIframeSelector ||
            !!record?.element?.selectedIframeSelector) &&
          (record.isInIframe || record?.element?.isInIframe) &&
          ![
            assertionTypes.toHaveTitle,
            assertionTypes.toHaveURL,
            assertionTypes.notToHaveTitle,
            assertionTypes.notToHaveURL,
          ].includes((record.assertionType?.type ?? '') as assertionTypes)

        return (
          <Record
            key={record.id}
            setDragOverIndex={setDragOverIndex}
            dragOverIndex={dragOverIndex}
            events={events}
            record={record}
            currentIndex={index}
            isFirstRecord={isFirstEvent}
          >
            <div
              css={css`
                text-align: center;
                min-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                max-width: ${isExpanded ? EXPANDED_WIDTH : DEFAULT_WIDTH};
                display: flex;
                flex-direction: column;
                height: calc(100% - ${hasIframeSelector ? '30px' : '0px'});
              `}
            >
              <Selector
                width={expandedId === record.id ? '100%' : DEFAULT_WIDTH}
                record={record}
              />
              <EventEntity
                prefersDarkMode={prefersDarkMode}
                isExpanded={expandedId === record.id}
                record={record}
                index={index.toString()}
                isFirstEntity={isFirstEvent}
              />
            </div>
          </Record>
        )
      })}
    </>
  )
}

export default memo(EventsList)
