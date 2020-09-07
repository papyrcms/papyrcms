import { Product, Order } from 'types'
import React, { useState, useEffect, useContext } from 'react'
import Error from 'next/error'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import userContext from '@/context/userContext'
import styles from './orders.module.scss'

const Orders = () => {
  const { currentUser } = useContext(userContext)
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    const resetOrders = async () => {
      if (currentUser?.isAdmin) {
        const { data: foundOrders } = await axios.get(
          '/api/store/orders'
        )
        setOrders(foundOrders)
      }
    }
    resetOrders()
  }, [currentUser])

  if (!currentUser || !currentUser.isAdmin)
    return <Error statusCode={403} />

  const renderProducts = (products: Product[]) => {
    return _.map(products, (product) => {
      return (
        <p className="order__product" key={product._id}>
          {product.title}
        </p>
      )
    })
  }

  const markShipped = (shippedOrder: Order) => {
    const newOrder = {
      ...shippedOrder,
      shipped: !shippedOrder.shipped,
    }
    axios
      .put(`/api/store/orders/${shippedOrder._id}`, newOrder)
      .then((response) => {
        const newOrders = _.map(orders, (order) => {
          if (order._id === newOrder._id) {
            order = newOrder
          }
          return order
        })
        setOrders(newOrders)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const deleteOrder = (deletedOrder: Order) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this order?'
    )
    if (!confirm) return

    axios
      .delete(`/api/store/orders/${deletedOrder._id}`)
      .then((response) => {
        const newOrders = _.filter(
          orders,
          (order) => order._id !== deletedOrder._id
        )
        setOrders(newOrders)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const renderOrders = () => {
    return _.map(orders, (order) => {
      const { created, user, products, _id, notes, shipped } = order

      return (
        <li key={_id} className={styles['order']}>
          <p>This has {!shipped && 'not '}been shipped.</p>
          <div className={styles.info}>
            {
              // Address info is based on a user bound to the order
              // If the user was logged out, this breaks.
              // The address should already be in the notes 100% of the time anyway
              /* <div className={styles.infoAddress}>
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
            </div> */
            }

            <div className={styles.infoProducts}>
              <h3 className="heading-tertiary">Products:</h3>
              <ul className={styles['order__products']}>
                {renderProducts(products)}
              </ul>
            </div>

            <div className={styles.infoNotes}>
              <h3 className="heading-tertiary">Order Notes:</h3>
              <p>{notes || 'none'}</p>
            </div>

            <div className={styles.infoCreated}>
              <h3 className="heading-tertiary">Created:</h3>
              <p>{moment(created).format('MMMM Do, YYYY')}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.ship} button button-primary`}
              onClick={() => markShipped(order)}
            >
              Mark {order.shipped && 'not '}shipped
            </button>
            <button
              className={`${styles.delete} button button-delete`}
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
    <div className={styles.main}>
      <h2 className="heading-secondary u-margin-bottom-small">
        Orders
      </h2>
      <ul>{renderOrders()}</ul>
    </div>
  )
}

export default Orders
