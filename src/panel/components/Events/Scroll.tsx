import { useRef, useEffect, useState, memo } from 'react'
import { css } from '@emotion/react'

import { IEventPayload } from '../../redux/eventRecorderSlice'

interface IScrollProps {
  events: Array<IEventPayload | IEventPayload[]>
  wrapper: HTMLDivElement | null
  scrollPosition: number
}

const ORIGINAL_BAR_WIDTH = 88

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

    const scaleFactor = width / scrollWidth
    const slidingWindowSize = width * scaleFactor

    setScrollLeftOffset(scrollPosition * scaleFactor)
    setScrollWindowSize(slidingWindowSize)

    if (ctx) {
      ctx.canvas.width = width
      ctx.canvas.height = 30

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.fillStyle = '#eee'

      const barWidth = Math.floor(ORIGINAL_BAR_WIDTH * scaleFactor)

      let prevOffset = 0

      events.forEach((it) => {
        const deltaTime =
          (it as IEventPayload[])?.[0]?.deltaTime ??
          (it as IEventPayload)?.deltaTime ??
          0

        const offset = prevOffset + deltaTime

        ctx.fillRect(offset * scaleFactor, 0, barWidth, 30)
        prevOffset = offset + ORIGINAL_BAR_WIDTH
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
