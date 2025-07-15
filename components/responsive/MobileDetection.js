import { useState, useEffect } from 'react'

/**
 * Mobile Detection Hook
 * Provides mobile detection and responsive utilities
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [screenSize, setScreenSize] = useState('desktop')
  const [touchDevice, setTouchDevice] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent

      // Check for touch capability
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setTouchDevice(hasTouchSupport)

      // Screen size detection
      if (width <= 480) {
        setScreenSize('mobile')
        setIsMobile(true)
        setIsTablet(false)
      } else if (width <= 768) {
        setScreenSize('tablet')
        setIsMobile(false)
        setIsTablet(true)
      } else if (width <= 1024) {
        setScreenSize('small-desktop')
        setIsMobile(false)
        setIsTablet(false)
      } else {
        setScreenSize('desktop')
        setIsMobile(false)
        setIsTablet(false)
      }

      // Additional mobile user agent check
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      if (mobileRegex.test(userAgent)) {
        setIsMobile(true)
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    screenSize,
    touchDevice,
    isSmallScreen: isMobile || isTablet,
    isDesktop: !isMobile && !isTablet,
  }
}

/**
 * Touch Gesture Hook
 * Provides touch gesture detection for mobile devices
 */
export const useTouchGestures = ({ onPinch, onPan, onTap, onLongPress }) => {
  useEffect(() => {
    let touchStartTime = 0
    let touchStartPos = { x: 0, y: 0 }
    let initialDistance = 0
    let lastTouchCount = 0
    let longPressTimer = null

    const getTouchDistance = (touches) => {
      if (touches.length < 2) return 0
      const [touch1, touch2] = touches
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const getTouchCenter = (touches) => {
      if (touches.length === 1) {
        return { x: touches[0].clientX, y: touches[0].clientY }
      }
      const x = (touches[0].clientX + touches[1].clientX) / 2
      const y = (touches[0].clientY + touches[1].clientY) / 2
      return { x, y }
    }

    const handleTouchStart = (e) => {
      touchStartTime = Date.now()
      touchStartPos = getTouchCenter(e.touches)
      lastTouchCount = e.touches.length

      if (e.touches.length === 2) {
        initialDistance = getTouchDistance(e.touches)
      }

      // Long press detection for single touch
      if (e.touches.length === 1 && onLongPress) {
        longPressTimer = setTimeout(() => {
          onLongPress({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            originalEvent: e,
          })
        }, 500) // 500ms for long press
      }
    }

    const handleTouchMove = (e) => {
      // Clear long press if finger moves
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      if (e.touches.length === 2 && onPinch) {
        e.preventDefault()
        const currentDistance = getTouchDistance(e.touches)
        const scale = currentDistance / initialDistance
        const center = getTouchCenter(e.touches)

        onPinch({
          scale,
          center,
          originalEvent: e,
        })
      } else if (e.touches.length === 1 && onPan) {
        const currentPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        const deltaX = currentPos.x - touchStartPos.x
        const deltaY = currentPos.y - touchStartPos.y

        onPan({
          deltaX,
          deltaY,
          currentPos,
          startPos: touchStartPos,
          originalEvent: e,
        })
      }
    }

    const handleTouchEnd = (e) => {
      // Clear long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - touchStartTime

      // Tap detection (quick touch)
      if (touchDuration < 200 && lastTouchCount === 1 && onTap) {
        onTap({
          x: touchStartPos.x,
          y: touchStartPos.y,
          duration: touchDuration,
          originalEvent: e,
        })
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [onPinch, onPan, onTap, onLongPress])
}
