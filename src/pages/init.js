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

  }


  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>

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

        <Input
          formState={formState}
          name="siteLogo"
          label="Site Logo"
        />

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

        <Input
          formState={formState}
          name="pageContent"
          label="First Page Content"
        />

        <button className="button button-primary" type="submit">Submit</button>

      </form>
    )
  }


  const renderModals = () => {
    return (
      <>
        <Modal
          closeId="auth-next"
          buttonId="auth-modal"
          onClose={() => document.getElementById('header-modal').click()}
        >
          <p>First, let's get you set up with an admin account. With this account, you can manage the website by going to your admin dashboard. This can be accessed from your profile.</p>
          <button className="button button-primary" id="auth-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="header-next"
          buttonId="header-modal"
          onClose={() => document.getElementById('footer-modal').click()}
        >
          <p>Next, we can set some content for your header.</p>
          <button className="button button-primary" id="header-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="footer-next"
          buttonId="footer-modal"
          onClose={() => document.getElementById('page-modal').click()}
        >
          <p>Next we can set some content for your footer.</p>
          <button className="button button-primary" id="footer-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="page-next"
          buttonId="page-modal"
          onClose={() => document.getElementById('confirm-modal').click()}
        >
          <p>Now we'll set up your first page. For now, we'll make this your main landing page, but you can change that later from your admin dashboard.</p>
          <button className="button button-primary" id="page-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="confirm-next"
          buttonId="confirm-modal"
        >
          <p>Before we submit all of this, go ahead and look over everything to make sure it looks okay.</p>
          <button className="button button-primary" id="confirm-next">
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
