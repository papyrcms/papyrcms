import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import keys from '@/keys'
import { initGA, logPageView } from '@/utilities/analytics'

const useGa = () => {
  const { asPath } = useRouter()
  const [gaInitialized, setGaInitialized] = useState(false)

  useEffect(() => {
    if (!gaInitialized) {
      setGaInitialized(true)
      initGA(keys.googleAnalyticsId)
    }
    if (gaInitialized) {
      logPageView()
    }
    FontAwesome.config.autoAddCss = false
  }, [asPath])
}

export default useGa
