import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

const useNextAnchors = () => {
  const { asPath, push } = useRouter()
  const anchorsRef = useRef<
    [HTMLAnchorElement, EventListenerOrEventListenerObject][]
  >([])

  useEffect(() => {
    const anchors = document.querySelectorAll('a')
    for (const anchor of anchors) {
      if (anchor.classList.contains('papyr-link')) {
        const handleClick = (event: any) => {
          event.preventDefault()
          push(event.target.href)
        }
        anchor.addEventListener('click', handleClick)
        anchorsRef.current.push([anchor, handleClick])
      }
    }

    return () => {
      anchorsRef.current.forEach(([anchor, callback]) => {
        anchor.removeEventListener('click', callback)
      })
    }
  }, [asPath])
}

export default useNextAnchors
