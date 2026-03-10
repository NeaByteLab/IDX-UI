import { useEffect, useState } from 'react'

const mobileBreakpoint = 768

export function useSidebarState(): [boolean, (open: boolean) => void, boolean] {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      const mobile = globalThis.innerWidth < mobileBreakpoint
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false)
      }
    }
    handleResize()
    globalThis.addEventListener('resize', handleResize)
    return () => globalThis.removeEventListener('resize', handleResize)
  }, [])
  return [isOpen, setIsOpen, isMobile]
}
