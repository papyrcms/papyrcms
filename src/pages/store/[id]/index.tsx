import React, { Fragment, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import userContext from '../../../context/userContext'
import keys from '../../../config/keys'
import { PostShow } from '../../../components/Sections'


const StoreShow = props => {

  const { currentUser } = useContext(userContext)

  const [product, setProduct] = useState(props.product)
  const { query } = useRouter()

  useEffect(() => {
    const resetProduct = async () => {
      if (currentUser && currentUser.isAdmin) {
        const { data: product } = await axios.get(`/api/store/products/${query.id}`)
        setProduct(product)
      }
    }
    resetProduct()
  }, [currentUser])


  const renderProductDetails = () => {
    return (
      <Fragment>
        <p>${product.price.toFixed(2)}</p>
        <p>{product.quantity} in stock</p>
      </Fragment>
    )
  }

  return (
    <PostShow
      post={product}
      path="store"
      apiPath="/api/store/products"
      redirectRoute="/store"
      afterContent={renderProductDetails}
    />
  )
}


StoreShow.getInitialProps = async ({ query }) => {

  try {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const { data: product } = await axios.get(`${rootUrl}/api/store/products/${query.id}`)
    return { product }
  } catch (err) {
    return { product: null }
  }
}


export default StoreShow
