import { useRef, useEffect, useState, memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload } from '../../redux/eventRecorderSlice'

interface IScrollProps {
  events: Array<IEventPayload | IEventPayload[]>
  wrapper: HTMLDivElement | null
  scrollPosition: number
}

function Scroll({ events, wrapper, scrollPosition }: IScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [scrollLeftOffset, setScrollLeftOffset] = useState(0)
  const [scrollWindowSize, setScrollWindowSize] = useState(0)

  useEffect(() => {
    if (!canvasRef.current || !events || !wrapper) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    const { width } = wrapper.getBoundingClientRect()
    const scrollWidth = wrapper.scrollWidth

    const lastTriggeredAt =
      (events[events.length - 1] as IEventPayload[])?.[0]?.triggeredAt ??
      (events[events.length - 1] as IEventPayload)?.triggeredAt

    const factor = width / lastTriggeredAt
    const scrollFactor = width / scrollWidth
    const slidingWindowSize = (width * width) / scrollWidth

    setScrollLeftOffset(scrollPosition * scrollFactor)
    setScrollWindowSize(slidingWindowSize)

    if (ctx) {
      ctx.canvas.width = width
      ctx.canvas.height = 30

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.fillStyle = '#eee'

      events.forEach((it, index, arr) => {
        const triggeredAt =
          (it as IEventPayload[])?.[0]?.triggeredAt ??
          (it as IEventPayload)?.triggeredAt ??
          0

        const v =
          arr.length == index + 1
            ? triggeredAt * factor - 10
            : triggeredAt * factor

        ctx.fillRect(v, 0, 5, 30)
      })
    }
  }, [events, scrollPosition])

  const isScrollVisible = !!events && !!events.length

  if (!isScrollVisible) {
    return null
  }

  return (
    <div
      css={css`
        position: relative;
        padding-top: 8px;
        padding-bottom: 8px;
      `}
    >
      <div
        css={css`
          position: absolute;
          left: ${scrollLeftOffset}px;
          width: ${scrollWindowSize}px;
          height: 38px;
          border: 2px solid #aaa;
          top: 4px;
        `}
      />
      <canvas ref={canvasRef} />
    </div>
  )
}

export default memo(Scroll)
