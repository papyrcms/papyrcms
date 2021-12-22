import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import Error from 'next/error'
import axios from 'axios'
import { useUser, pagesContext } from '@/context'
import styles from './pages.module.scss'

const Pages = () => {
  let { pages, setPages } = useContext(pagesContext)
  const { currentUser } = useUser()

  useEffect(() => {
    const getPages = async () => {
      const { data: pages } = await axios.get('/api/pages')
      setPages(pages)
    }
    getPages()
  }, [])

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  const renderPages = () => {
    return pages
      .sort((a, b) => (a.navOrder < b.navOrder ? 1 : -1))
      .map((page) => (
        <li className={styles.page} key={page.id}>
          <div>
            Visit page{' - '}
            <Link href="/[page]" as={`/${page.route}`}>
              <a>/{page.route}</a>
            </Link>
          </div>

          <div className={styles.linkDivider}>|</div>

          <div>
            Edit page{' - '}
            <Link
              href="/admin/pages/[page]"
              as={`/admin/pages/${page.route}`}
            >
              <a>/admin/pages/{page.route}</a>
            </Link>
            {' - '} Menu: {page.navOrder}
          </div>
        </li>
      ))
  }

  return (
    <div className={styles.main}>
      <h2 className="heading-secondary">Pages</h2>
      <ul>{renderPages()}</ul>
    </div>
  )
}

export default Pages
