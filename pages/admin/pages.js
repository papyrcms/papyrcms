import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'


const renderPages = pages => {
  return pages.map(page => (
    <li className="pages__page" key={page._id}>

      <div className="pages__link--visit">
        Visit page{' - '}
        <Link href={`/_page?page=${page.route}`} as={`/${page.route}`}>
          <a>/{page.route}</a>
        </Link>
      </div>

      <div className="pages__link-divider">|</div>

      <div className="pages__link--edit">
        Edit page{' - '}
        <Link href={`/admin/page-builder?page=${page.route}`} as={`/admin/pages/${page.route}`}>
          <a>/admin/pages/{page.route}</a>
        </Link>
      </div>

    </li>
  ))
}


const Pages = props => {

  const { currentUser } = props

  if (!currentUser || !currentUser.isAdmin) {
    return <div />
  }

  return (
    <div className="pages-page">
      <h2 className="heading-secondary">Pages</h2>
      <ul className="pages">
        {renderPages(props.pages)}
      </ul>
    </div>
  )
}


Pages.getInitialProps = async ({ req }) => {

  const rootUrl = keys.rootURL ? keys.rootURL : ''

  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  const res = await axios.get(`${rootUrl}/api/page`, axiosConfig)

  return { pages: res.data }
}


const mapStateToProps = state => {
  return { pages: state.pages, currentUser: state.currentUser }
}


export default connect(mapStateToProps)(Pages)