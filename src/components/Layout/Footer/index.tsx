import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { Page } from '@/types'
import { usePages } from '@/context'
import styles from './Footer.module.scss'

type Props = {
  footerTitle: string
  footerContent: string
  footerCopyrightContent: string
}

const Footer: React.FC<Props> = (props) => {
  const { pages } = usePages()
  const { query } = useRouter()

  const page = pages.find((foundPage) => {
    if (foundPage.route === '') foundPage.route = 'home'
    if (foundPage.route === query.page) return true
  }) as Page

  if (page?.omitDefaultFooter) {
    return null
  }

  return (
    <footer className={styles.footer}>
      {/* Footer contact form */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>{props.footerTitle}</h2>
        <div
          dangerouslySetInnerHTML={{ __html: props.footerContent }}
        />
      </div>

      {/* Credit section */}
      <div className={styles.credit}>
        <div
          className={styles.creditText}
          dangerouslySetInnerHTML={{
            __html: props.footerCopyrightContent,
          }}
        />
      </div>
    </footer>
  )
}

export default Footer
