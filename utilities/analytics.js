import ReactGA from 'react-ga'
import axios from 'axios'

export const initGA = async () => {
  const res = await axios.get('/api/googleAnalyticsId')

  ReactGA.initialize(res.data)
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
