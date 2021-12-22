import React, { useContext } from 'react'
import Link from 'next/link'
import { useSettings, pagesContext, usePosts } from '@/context'
import { Page, Tags } from '@/types'
import styles from './NavMenu.module.scss'
import { useRouter } from 'next/router'
import { usePostFilter } from 'src/hooks'

const onClick = () => {
  const checkbox = document.getElementById('nav-menu-checkbox')
  checkbox?.classList.toggle(styles.checked)
}

type LinkProps = {
  exact?: boolean
  href: string
  title?: string
  children: string
  isExternal: boolean
}

const NavLink: React.FC<LinkProps> = (props) => {
  const { asPath } = useRouter()

  if (props.isExternal) {
    return (
      <a
        href={props.href}
        target="_blank"
        className={styles.item}
        title={props.title || props.children}
      >
        <li onClick={onClick}>{props.children}</li>
      </a>
    )
  }

  return (
    <Link href={props.href}>
      <a
        className={`${styles.item} ${
          asPath === props.href && styles.selected
        }`}
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
          const isExternal = page.className === 'external-link'
          let href = page.route
          if (!isExternal) {
            href = page.route === 'home' ? '/' : `/${page.route}`
          }
          return (
            <NavLink
              href={href}
              key={page.id}
              isExternal={page.className === 'external-link'}
            >
              {page.title}
            </NavLink>
          )
        })}
    </div>
  )
}

const NavMenu: React.FC<{ logo?: string }> = (props) => {
  const { pages } = useContext(pagesContext)
  const { posts } = usePosts()
  const { settings } = useSettings()

  const renderMenuItems = () => {
    let menuPages = [...pages]

    const postFilterSettings = {
      postTags: [Tags.externalLink],
    }
    const { posts: externalLinkPosts } = usePostFilter(
      posts,
      postFilterSettings
    )
    externalLinkPosts.forEach((post) => {
      const route = post.content
        .replace('<p>', '')
        .replace('</p>', '')
      const order = post.tags
        .find((tag) => tag.includes('order-'))
        ?.split('-')[1]
      const navOrder =
        !order || isNaN(parseFloat(order)) ? 0 : parseFloat(order)

      if (navOrder) {
        menuPages.push({
          id: route,
          route,
          title: post.title,
          navOrder,
          className: 'external-link',
        } as Page)
      }
    })

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
        const isExternal = page.className === 'external-link'
        let href = page.route
        if (!isExternal) {
          href = page.route === 'home' ? '/' : `/${page.route}`
        }
        return (
          <NavLink href={href} key={page.id} isExternal={isExternal}>
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
