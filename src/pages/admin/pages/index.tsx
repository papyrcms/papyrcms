import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import Error from 'next/error'
import _ from 'lodash'
import axios from 'axios'
import { userContext, pagesContext } from '@/context'
import styles from './pages.module.scss'

const Pages = () => {
  const { pages, setPages } = useContext(pagesContext)
  const { currentUser } = useContext(userContext)

  useEffect(() => {
    const getPages = async () => {
      const { data: pages } = await axios.get('/api/pages')
      setPages(pages)
    }
    getPages()
  }, [])

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  const renderPages = () => {
    return _.map(pages, (page) => (
      <li className={styles.page} key={page._id}>
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
