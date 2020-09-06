import ReactGA from 'react-ga'

export const initGA = async (googleAnalyticsId: string) => {
  if (!GA_INITIALIZED) {
    ReactGA.initialize(googleAnalyticsId)
    GA_INITIALIZED = true

    logPageView()
  }
}

export const logPageView = () => {
  if (GA_INITIALIZED) {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  }
}

export const logEvent = (category?: string, action?: string) => {
  if (GA_INITIALIZED && category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (
  description?: string,
  fatal?: boolean
) => {
  if (GA_INITIALIZED && description) {
    ReactGA.exception({ description, fatal })
  }
}
