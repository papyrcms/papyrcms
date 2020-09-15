import React, { useContext } from 'react'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { Page } from 'types'
import { pagesContext } from '@/context'

type Props = {
  footerTitle: string
  footerContent: string
  footerCopyrightContent: string
}

const Footer: React.FC<Props> = (props) => {
  const { pages } = useContext(pagesContext)
  const { query } = useRouter()

  const page = _.find(pages, (foundPage) => {
    if (foundPage.route === '') foundPage.route = 'home'
    if (foundPage.route === query.page) return true
  }) as Page

  if (page?.omitDefaultFooter) {
    return null
  }

  return (
    <footer className="footer">
      {/* Footer contact form */}
      <div className="cta">
        <h2 className="cta__title u-margin-bottom-small">
          {props.footerTitle}
        </h2>
        <div className="cta__content">{props.footerContent}</div>
      </div>

      {/* Credit section */}
      <div className="credit">
        <div className="credit__text">
          {props.footerCopyrightContent}
        </div>
      </div>
    </footer>
  )
}

export default Footer
