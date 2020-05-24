import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import _ from 'lodash'
import axios from 'axios'
import userContext from '@/context/userContext'
import pagesContext from '@/context/pagesContext'


const Pages = () => {

  const { pages, setPages } = useContext(pagesContext)
  const { currentUser } = useContext(userContext)
  if (!currentUser || !currentUser.isAdmin) return null

  useEffect(() => {
    const getPages = async () => {
      const { data: pages } = await axios.get('/api/pages')
      setPages(pages)
    }
    getPages()
  }, [])


  const renderPages = () => {

    return _.map(pages, page => (
      <li className='pages__page' key={page._id}>
        <div className='pages__link--visit'>
          Visit page{" - "}
          <Link href="/[page]" as={`/${page.route}`}>
            <a>/{page.route}</a>
          </Link>
        </div>

        <div className='pages__link-divider'>|</div>

        <div className='pages__link--edit'>
          Edit page{" - "}
          <Link href={`/admin/pages/${page.route}`}>
            <a>/admin/pages/{page.route}</a>
          </Link>
        </div>
      </li>
    ))
  }


  return (
    <div className="pages-page">
      <h2 className="heading-secondary">Pages</h2>
      <ul className="pages">
        {renderPages()}
      </ul>
    </div>
  )
}


export default Pages