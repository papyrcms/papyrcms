import ReactGA from 'react-ga'
import axios from 'axios'

export const initGA = async () => {
  if (!window.GA_INITIALIED) {
    const res = await axios.post('/api/googleAnalyticsId')

    ReactGA.initialize(res.data)
    window.GA_INITIALIED = true

    logPageView()
  }
}

export const logPageView = () => {
  if (window.GA_INITIALIED) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export const logEvent = (category = '', action = '') => {
  if (window.GA_INITIALIED && category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (window.GA_INITIALIED && description) {
    ReactGA.exception({ description, fatal })
  }
}
