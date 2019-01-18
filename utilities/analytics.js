import ReactGA from 'react-ga'

export const initGA = googleAnalyticsId => {
  console.log(googleAnalyticsId)
  ReactGA.initialize(googleAnalyticsId)
}

export const logPageView = () => {
  console.log(window.location.pathname)
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
