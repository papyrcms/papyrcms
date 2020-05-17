import ReactGA from 'react-ga'

declare global {
  interface Window { GA_INITIALIZED: any }
}

export const initGA = async (googleAnalyticsId: string) => {
  if (!window.GA_INITIALIZED) {
    ReactGA.initialize(googleAnalyticsId)
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
