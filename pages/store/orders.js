import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import { setOrders } from '../../reduxStore'
import keys from '../../config/keys'


const Orders = props => {

  const { orders, setOrders } = props

  const renderProducts = products => {
    return products.map(product => {
      return <p className="order__product" key={product._id}>{product.title}</p>
    })
  }

  const markShipped = shippedOrder => {
    const newOrder = { ...shippedOrder, shipped: !shippedOrder.shipped }
    axios.put(`/api/orders/${shippedOrder._id}`, newOrder)
      .then(response => {
        const newOrders = orders.map(order => {
          if (order._id === newOrder._id) {
            order = newOrder
          }
          return order
        })
        setOrders(newOrders)
      }).catch(error => {
        console.error(error)
      })
  }

  const deleteOrder = deletedOrder => {
    axios.delete(`/api/orders/${deletedOrder._id}`)
      .then(response => {
        const newOrders = orders.filter(order => order._id !== deletedOrder._id)
        setOrders(newOrders)
      }).catch(error => {
        console.errors(error)
      })
  }

  const renderOrders = () => {
    return orders.map(order => {
      const { created, user, products, _id, notes, shipped } = order

      return (
        <li key={_id} className="order">
          <p>This has {!shipped && 'not '}been shipped.</p>
          <div className="order__info">
            <div className="order__info--address">
              <h3 className="heading-tertiary">Ship to:</h3>
              <p>
                {user.shippingFirstName || user.firstName}
                {' '}
                {user.shippingLastName || user.lastName}
              </p>
              <p>{user.shippingAddress1 || user.address1}</p>
              {() => {
                if (user.shippingAddress2 || user.address2)
                return <p>{user.shippingAddress2 || user.address2}</p>
              }}
              <p>
                {user.shippingCity || user.city}
                {', '}
                {user.shippingState || user.state}
                {' '}
                {user.shippingZip || user.zip}
              </p>
              <p>{user.shippingCountry || user.country}</p>
            </div>

            <div className="order__info--products">
              <h3 className="heading-tertiary">Products:</h3>
              <ul className="order__products">{renderProducts(products)}</ul>
            </div>

            <div className="order__info--created">
              <h3 className="heading-tertiary">Created:</h3>
              <p>{moment(created).tz('America/Chicago').format('MMMM Do, YYYY')}</p>
            </div>

            <div className="order__info--notes">
              <h3 className="heading-tertiary">Order Notes:</h3>
              <p>{notes || 'none'}</p>
            </div>
          </div>

          <div className="order__actions">
            <button
              className="order__ship button button-primary"
              onClick={() => markShipped(order)}
            >
              Mark {order.shipped && 'not '}shipped
            </button>
            <button
              className="order__delete button button-delete"
              onClick={() => deleteOrder(order)}
            >
              Delete
            </button>
          </div>
        </li>
      )
    })
  }

  return (
    <div className="orders">
      <h2 className="heading-secondary u-margin-bottom-small">Orders</h2>
      <ul className="orders__list">
        {renderOrders()}
      </ul>
    </div>
  )
}


Orders.getInitialProps = async ({ req }) => {

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

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const orders = await axios.get(`${rootUrl}/api/orders`, axiosConfig)

  return { orders: orders.data }
}


const mapStateToProps = state => {
  return { orders: state.orders }
}


export default connect(mapStateToProps, { setOrders })(Orders)
