import { Product } from 'types'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import keys from '@/keys'
import { storeContext } from '@/context'
import { CreditCardForm, Input, UserInfoForm } from '@/components'
import styles from './checkout.module.scss'

const Checkout = (props: { product: Product }) => {
  const cartState = useContext(storeContext)

  let cart: Product[] = []
  let fromCart = false

  // Get the checkout item(s)
  if (props.product) {
    cart = [props.product]
  } else {
    cart = cartState.cart
    fromCart = true
  }

  const [orderNotes, setOrderNotes] = useState('')
  const [handleSubmitSuccess, setHandleSubmitSuccess] = useState<
    Function
  >(() => null)
  const [handleSubmitError, setHandleSubmitError] = useState<
    Function
  >(() => null)

  const handleCardSubmit = (
    source: any,
    resetButton: Function,
    setValidation: Function
  ) => {
    const errorFunction = () => {
      resetButton()
      setValidation('Something went wrong.')
    }
    setHandleSubmitError(() => errorFunction)

    const successFunction = (formState: { submitForm: Function }) => {
      const additionalValues = {
        fromCart,
        source,
        notes: orderNotes,
        products: cart,
      }

      const success = () => {
        resetButton()
        setValidation('Your order has been sent!')
        if (fromCart) {
          cartState.clearCart()
        }
      }

      const error = (err: any) => {
        resetButton()
        if (err.response) {
          setValidation(err.response.data.message)
        }
      }

      formState.submitForm(
        '/api/store/checkout',
        { success, error },
        false,
        additionalValues
      )
    }
    setHandleSubmitSuccess(() => successFunction)

    const userInfoForm = document.getElementById('userInfoForm')
    if (userInfoForm) userInfoForm.dispatchEvent(new Event('submit'))
  }

  const renderProductsList = () => {
    return _.map(cart, (product, i) => {
      return (
        <p key={product._id + i.toString()}>
          {product.title}: ${product.price.toFixed(2)}
        </p>
      )
    })
  }

  const renderTotalCost = () => {
    let totalCost = 0
    _.forEach(cart, (product) => (totalCost += product.price))
    return (
      <p className="u-margin-bottom-small">
        Total Cost: ${totalCost.toFixed(2)}
      </p>
    )
  }

  return (
    <section className={styles.main}>
      <div className={styles.container}>
        <h2 className="heading-secondary">Checkout</h2>

        <UserInfoForm
          useSubmit={false}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        >
          <Input
            type="textarea"
            label="Additional notes about the order"
            name="orderNotes"
            value={orderNotes}
            onChange={(event: any) =>
              setOrderNotes(event.target.value)
            }
          />

          {renderProductsList()}
          <hr />
          {renderTotalCost()}

          <CreditCardForm onSubmit={handleCardSubmit} />
        </UserInfoForm>
      </div>
    </section>
  )
}

Checkout.getInitialProps = async ({
  query,
}: {
  query: { id: string }
}) => {
  const rootUrl = keys.rootURL ? keys.rootURL : ''

  let product
  if (query.id) {
    const res = await axios.get(
      `${rootUrl}/api/store/products/${query.id}`
    )
    product = res.data
  }

  return { product }
}

export default Checkout
