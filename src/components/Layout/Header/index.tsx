import { Page, Post, Tags } from '@/types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  useSettings,
  useStore,
  useUser,
  usePages,
  useSectionOptions,
} from '@/context'
import styles from './Header.module.scss'
import { SectionRenderer } from '@/components'

type Props = {
  mainTitle: string
  subTitle: string
  customHeader?: Post
}

const Header: React.FC<Props> = (props) => {
  const { mainTitle, subTitle, customHeader } = props
  const { currentUser } = useUser()
  const { settings } = useSettings()
  const { pages } = usePages()
  const { query } = useRouter()
  const { cart } = useStore()
  const { sectionOptions } = useSectionOptions()

  const page = pages.find((foundPage) => {
    if (foundPage.route === '') foundPage.route = 'home'
    if (foundPage.route === query.page) return true
  }) as Page

  if (page?.omitDefaultHeader) {
    return null
  }

  const renderAuthenticator = () => {
    if (currentUser) {
      return (
        <Link href="/profile">
          <a
            title="Profile"
            className={`${styles.item} ${styles.menu1}`}
          >
            <li>Profile</li>
          </a>
        </Link>
      )
    }

    return (
      <Link href="/login">
        <a title="Login" className={`${styles.item} ${styles.menu1}`}>
          <li>Login</li>
        </a>
      </Link>
    )
  }

  const renderCart = () => {
    if (settings.enableStore) {
      const menuText = `Cart${
        cart.length !== 0 ? ` (${cart.length})` : ''
      }`

      return (
        <Link href="/store/cart">
          <a
            title="Cart"
            className={`${styles.item} ${styles.menu2}`}
          >
            <li>{menuText}</li>
          </a>
        </Link>
      )
    }
  }

  const renderAdminItems = () => {
    if (currentUser?.isAdmin) {
      return (
        <Link href="/posts/new">
          <a
            title="Content"
            className={`${styles.item} ${styles.menu3}`}
          >
            <li>Add Content</li>
          </a>
        </Link>
      )
    }
  }

  const renderMenu = () => {
    if (settings.enableMenu || currentUser?.isAdmin) {
      return (
        <ul className={styles.menu}>
          {renderAuthenticator()}
          {renderCart()}
          {/* {renderAdminItems()} */}
        </ul>
      )
    }
  }

  const renderTitle = () => {
    // if (page.title) {
    //   return <span className="heading-primary--main">{page.title}</span>
    // }

    return (
      <>
        <span className="heading-primary--main">{mainTitle}</span>
        <span
          className="heading-primary--sub"
          dangerouslySetInnerHTML={{ __html: subTitle }}
        />
      </>
    )
  }

  if (customHeader) {
    const type =
      Object.keys(sectionOptions).find((key) =>
        customHeader.tags.includes(
          Tags.sectionType(key.toLowerCase())
        )
      ) ?? 'Standard'
    const option = sectionOptions[type]

    return (
      <header>
        <SectionRenderer
          component={option.component}
          posts={[customHeader]}
          defaultProps={option.defaultProps}
        />
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className="heading-primary">{renderTitle()}</h1>
        {renderMenu()}
      </div>
    </header>
  )
}

export default Header
