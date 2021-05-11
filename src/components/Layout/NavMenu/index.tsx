import React, { useContext } from 'react'
import Link from 'next/link'
import { settingsContext, pagesContext } from '@/context'
import { Page } from '@/types'
import styles from './NavMenu.module.scss'

const onClick = () => {
  const checkbox = document.getElementById('nav-menu-checkbox')
  checkbox?.classList.toggle(styles.checked)
}

type LinkProps = {
  exact?: boolean
  href: string
  title?: string
  children: string
}

const NavLink: React.FC<LinkProps> = (props) => {
  return (
    <Link href={props.href}>
      <a
        className={styles.item}
        title={props.title || props.children}
      >
        <li onClick={onClick}>{props.children}</li>
      </a>
    </Link>
  )
}

const Submenu: React.FC<{ pages: Page[] }> = ({ pages }) => {
  return (
    <div className={styles.submenu}>
      {pages
        .sort((a, b) => (a.navOrder > b.navOrder ? 1 : -1))
        .map((page) => {
          const href = page.route === 'home' ? '/' : `/${page.route}`
          return (
            <NavLink href={href} key={page.id}>
              {page.title}
            </NavLink>
          )
        })}
    </div>
  )
}

const NavMenu: React.FC<{ logo?: string }> = (props) => {
  const { pages } = useContext(pagesContext)
  const { settings } = useContext(settingsContext)

  const renderMenuItems = () => {
    let menuPages = [...pages]

    if (settings.enableBlog) {
      menuPages.push({
        id: 'blog',
        title: 'Blog',
        route: 'blog',
        navOrder: settings.blogMenuLocation,
      } as Page)
    }

    if (settings.enableEvents) {
      menuPages.push({
        id: 'events',
        title: 'Events',
        route: 'events',
        navOrder: settings.eventsMenuLocation,
      } as Page)
    }

    if (settings.enableStore) {
      menuPages.push({
        id: 'store',
        title: 'Store',
        route: 'store',
        navOrder: settings.storeMenuLocation,
      } as Page)
    }

    menuPages = menuPages.filter(
      (page) => !!page.title && !!page.navOrder
    )

    // Sort into submenu items
    interface MenuItem {
      page?: Page
      pages?: Page[]
      index: number
    }
    const menuItems: MenuItem[] = menuPages.reduce((items, page) => {
      const menuItem = items.find(
        (item) => item.index === Math.floor(page.navOrder)
      )
      if (!menuItem) {
        items.push({
          page,
          index: Math.floor(page.navOrder),
        })
      } else if (menuItem) {
        if (!menuItem.pages && menuItem.page) {
          menuItem.pages = []
          menuItem.pages.push(menuItem.page)
          delete menuItem.page
        }
        ;(menuItem.pages as Page[]).push(page)
      }
      return items
    }, [] as MenuItem[])

    menuItems.sort((a, b) =>
      typeof a === 'object' &&
      typeof b === 'object' &&
      a.index > b.index
        ? 1
        : -1
    )

    return menuItems.map(({ page, pages }) => {
      if (page) {
        const href = page.route === 'home' ? '/' : `/${page.route}`
        return (
          <NavLink href={href} key={page.id}>
            {page.title}
          </NavLink>
        )
      } else if (pages) {
        return <Submenu pages={pages} key={pages[0].id} />
      }
    })
  }

  const renderLogo = () => {
    if (props.logo) {
      return (
        <Link href="/">
          <a title="Home">
            <div className={styles.logo}>
              <img src={props.logo} alt="site logo" />
            </div>
          </a>
        </Link>
      )
    }
  }

  return (
    <nav>
      <ul className={styles.menu}>
        {renderLogo()}

        <div className={styles.items} id="nav-menu-checkbox">
          <span
            onClick={onClick}
            className={`${styles.item} ${styles.hamburger}`}
          />
          {renderMenuItems()}
        </div>
      </ul>
    </nav>
  )
}

export default NavMenu
