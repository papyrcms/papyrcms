import { useRouter } from 'next/router'
import { Page, Post, Tags } from '@/types'
import { usePages, useSectionOptions } from '@/context'
import styles from './Footer.module.scss'
import { SectionRenderer } from '@/components'

type Props = {
  footerTitle: string
  footerContent: string
  footerCopyrightContent: string
  customFooter?: Post
}

const Footer: React.FC<Props> = (props) => {
  const { pages } = usePages()
  const { query } = useRouter()
  const { sectionOptions } = useSectionOptions()

  const page = pages.find((foundPage) => {
    if (foundPage.route === '') foundPage.route = 'home'
    if (foundPage.route === query.page) return true
  }) as Page

  if (page?.omitDefaultFooter) {
    return null
  }

  if (props.customFooter) {
    const type =
      Object.keys(sectionOptions).find((key) =>
        props.customFooter?.tags.includes(
          Tags.sectionType(key.toLowerCase())
        )
      ) ?? 'Standard'
    const option = sectionOptions[type]

    return (
      <footer>
        <SectionRenderer
          component={option.component}
          posts={[props.customFooter]}
          defaultProps={option.defaultProps}
        />
      </footer>
    )
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
