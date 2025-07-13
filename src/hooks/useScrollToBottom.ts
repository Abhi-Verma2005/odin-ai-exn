import { useRef, useEffect } from 'react'

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T>,
  React.RefObject<T>,
] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return [containerRef, endRef]
} 