import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import Error from 'next/error'
import _ from 'lodash'
import axios from 'axios'
import userContext from '@/context/userContext'
import pagesContext from '@/context/pagesContext'
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
  
  if (!currentUser || !currentUser.isAdmin) return <Error statusCode={403} />

  const renderPages = () => {

    return _.map(pages, page => (
      <li className={styles['pages__page']} key={page._id}>
        <div className={styles['pages__link--visit']}>
          Visit page{" - "}
          <Link href="/[page]" as={`/${page.route}`}>
            <a>/{page.route}</a>
          </Link>
        </div>

        <div className={styles['pages__link-divider']}>|</div>

        <div className={styles['pages__link--edit']}>
          Edit page{" - "}
          <Link href="/admin/pages/[page]" as={`/admin/pages/${page.route}`}>
            <a>/admin/pages/{page.route}</a>
          </Link>
        </div>
      </li>
    ))
  }


  return (
    <div className={styles["pages-page"]}>
      <h2 className="heading-secondary">Pages</h2>
      <ul className={styles["pages"]}>
        {renderPages()}
      </ul>
    </div>
  )
}


export default Pages
