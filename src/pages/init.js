import React, { useEffect } from 'react'
import useForm from '@/hooks/useForm'
import Input from '@/components/Input'
import Modal from '@/components/Modal'


const Init = () => {

  const INITIAL_STATE = {
    email: '',
    password: '',

    headerTitle: '',
    headerSubtitle: '',
    siteLogo: '',

    footerTitle: '',
    footerSubtitle: '',

    pageHeader: '',
    pageImage: '',
    pageContent: '',
  }

  const formState = useForm(INITIAL_STATE)

  useEffect(() => {
    document.getElementById('auth-modal').click()
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log(formState)
  }


  const personalInfoInputs = () => {
    return (
      <div className="init-page__row">
        <Input
            formState={formState}
            name="email"
            type="email"
            required
            label="Email"
          />

          <Input
            formState={formState}
            name="password"
            type="password"
            required
            label="Password"
          />
      </div>
    )
  }


  const headerInputs = () => {
    return (
      <>
        <div className="init-page__row">
          <Input
            formState={formState}
            name="headerTitle"
            label="Header Title"
          />

          <Input
            formState={formState}
            name="headerSubtitle"
            label="Header Subtitle"
          />
        </div>

        <Input
          formState={formState}
          name="siteLogo"
          label="Site Logo"
        />
      </>
    )
  }


  const footerInputs = () => {
    return (
      <div className="init-page__row">
        <Input
          formState={formState}
          name="footerTitle"
          label="Footer Title"
        />

        <Input
          formState={formState}
          name="footerSubtitle"
          label="Footer Subtitle"
        />
      </div>
    )
  }


  const firstPageInputs = () => {
    return (
      <>
        <div className="init-page__row">
          <Input
            formState={formState}
            name="pageHeader"
            label="First Page Header"
          />

          <Input
            formState={formState}
            name="pageImage"
            label="First Page Image"
          />
        </div>

        <Input
          formState={formState}
          name="pageContent"
          label="First Page Content"
          type="textarea"
        />
      </>
    )
  }


  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="init-page">

        {personalInfoInputs()}

        {headerInputs()}

        {footerInputs()}

        {firstPageInputs()}

        <button className="button button-primary" type="submit">Submit</button>

      </form>
    )
  }


  const renderModals = () => {
    return (
      <>
        <Modal
          closeId="auth-next"
          className="init-page__modal"
          buttonId="auth-modal"
          onClose={() => document.getElementById('header-modal').click()}
        >
          <h3>First, let's get you set up with an admin account. With this account, you can manage the website by going to your admin dashboard. This can be accessed from your profile.</h3>
          {personalInfoInputs()}
          <button className="button button-primary init-page__modal--button" id="auth-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="header-next"
          className="init-page__modal"
          buttonId="header-modal"
          onClose={() => document.getElementById('footer-modal').click()}
        >
          <h3>Next, we can set some content for your header.</h3>
          {headerInputs()}
          <button className="button button-primary init-page__modal--button" id="header-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="footer-next"
          className="init-page__modal"
          buttonId="footer-modal"
          onClose={() => document.getElementById('page-modal').click()}
        >
          <h3>Next we can set some content for your footer.</h3>
          {footerInputs()}
          <button className="button button-primary init-page__modal--button" id="footer-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="page-next"
          className="init-page__modal"
          buttonId="page-modal"
          onClose={() => document.getElementById('confirm-modal').click()}
        >
          <h3>Now we'll set up your first page. For now, we'll make this your main landing page, but you can change that later from your admin dashboard.</h3>
          {firstPageInputs()}
          <button className="button button-primary init-page__modal--button" id="page-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="confirm-next"
          className="init-page__modal"
          buttonId="confirm-modal"
        >
          <h3>Before we submit all of this, go ahead and look over everything to make sure it looks okay.</h3>
          <button className="button button-primary init-page__modal--button" id="confirm-next">
            Okay
          </button>
        </Modal>
      </>
    )
  }


  return (
    <>
      {renderModals()}
      {renderForm()}
    </>
  )
}


export default Init
