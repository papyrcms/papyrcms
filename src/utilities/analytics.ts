import ReactGA from 'react-ga'
import axios from 'axios'

declare global {
  interface Window { GA_INITIALIZED: any }
}

export const initGA = async () => {
  if (!window.GA_INITIALIZED) {
    const res = await axios.post('/api/utility/googleAnalyticsId')

    ReactGA.initialize(res.data)
    window.GA_INITIALIZED = true

    logPageView()
  }
}

export const logPageView = () => {
  if (window.GA_INITIALIZED) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export const logEvent = (category = '', action = '') => {
  if (window.GA_INITIALIZED && category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (window.GA_INITIALIZED && description) {
    ReactGA.exception({ description, fatal })
  }
}
