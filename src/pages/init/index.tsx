import React, { useEffect, useContext } from 'react'
import Error from 'next/error'
import Router from 'next/router'
import { usePosts, pagesContext, useUser } from '@/context'
import { useForm } from '@/hooks'
import { Input, Modal } from '@/components'
import styles from './init.module.scss'

const Init = () => {
  const { posts, setPosts } = usePosts()
  const { pages, setPages } = useContext(pagesContext)
  const { setCurrentUser } = useUser()

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

  const clickNextModal = (id: string) => {
    const nextModal = document.getElementById(id)
    if (nextModal) nextModal.click()
  }

  useEffect(() => {
    clickNextModal('auth-modal')
  }, [])

  if (posts.length > 0 || pages.length > 0) {
    return <Error statusCode={403} />
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const success = (response: any) => {
      setPosts(response.data.posts)
      setPages(response.data.pages)

      localStorage.setItem('token', response.data.token)
      setCurrentUser(response.data.user)
      Router.push('/profile')
    }

    const error = (err: any) => {
      console.dir(err.toString())
    }

    await formState.submitForm('/api/utility/init', {
      success,
      error,
    })
  }

  const personalInfoInputs = (onForm?: boolean) => {
    return (
      <div className="u-form-row">
        <Input
          formState={formState}
          id={`email${onForm && 'Form'}`}
          name="email"
          type="email"
          required
          label="Email"
        />

        <Input
          formState={formState}
          id={`password${onForm && 'Form'}`}
          name="password"
          type="password"
          required
          label="Password"
        />
      </div>
    )
  }

  const headerInputs = (onForm?: boolean) => {
    return (
      <>
        <div className="u-form-row">
          <Input
            formState={formState}
            id={`headerTitle${onForm && 'Form'}`}
            name="headerTitle"
            label="Header Title"
            required
          />

          <Input
            formState={formState}
            id={`headerSubtitle${onForm && 'Form'}`}
            name="headerSubtitle"
            label="Header Subtitle"
            required
          />
        </div>

        <Input
          formState={formState}
          id={`siteLogo${onForm && 'Form'}`}
          name="siteLogo"
          label="Site Logo Image URL"
        />
      </>
    )
  }

  const footerInputs = (onForm?: boolean) => {
    return (
      <div className="u-form-row">
        <Input
          formState={formState}
          id={`footerTitle${onForm && 'Form'}`}
          name="footerTitle"
          label="Footer Title"
          required
        />

        <Input
          formState={formState}
          id={`footerSubtitle${onForm && 'Form'}`}
          name="footerSubtitle"
          label="Footer Subtitle"
          required
        />
      </div>
    )
  }

  const firstPageInputs = (onForm?: boolean) => {
    return (
      <>
        <div className="u-form-row">
          <Input
            formState={formState}
            name="pageHeader"
            id={`pageHeader${onForm && 'Form'}`}
            label="First Page Header"
            required
          />

          <Input
            formState={formState}
            name="pageImage"
            id={`pageImage${onForm && 'Form'}`}
            label="First Page Image URL"
            required
          />
        </div>

        <Input
          formState={formState}
          name="pageContent"
          id={`pageContent${onForm && 'Form'}`}
          label="First Page Content"
          type="textarea"
        />
      </>
    )
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className={styles.main}>
        {personalInfoInputs(true)}

        {headerInputs(true)}

        {footerInputs(true)}

        {firstPageInputs(true)}

        <p>{formState.values.validation}</p>

        <input className="button button-primary" type="submit" />
      </form>
    )
  }

  const renderModals = () => {
    const buttonClasses = `button button-primary ${styles.button}`
    return (
      <>
        <Modal
          closeId="auth-next"
          className={styles.modal}
          buttonId="auth-modal"
          onClose={() => clickNextModal('header-modal')}
        >
          <h3>
            First, let's get you set up with an admin account. With
            this account, you can manage the website by going to your
            admin dashboard. This can be accessed from your profile.
          </h3>
          {personalInfoInputs()}
          <button className={buttonClasses} id="auth-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="header-next"
          className={styles.modal}
          buttonId="header-modal"
          onClose={() => clickNextModal('footer-modal')}
        >
          <h3>Next, we can set some content for your header.</h3>
          {headerInputs()}
          <button className={buttonClasses} id="header-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="footer-next"
          className={styles.modal}
          buttonId="footer-modal"
          onClose={() => clickNextModal('page-modal')}
        >
          <h3>Next we can set some content for your footer.</h3>
          {footerInputs()}
          <button className={buttonClasses} id="footer-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="page-next"
          className={styles.modal}
          buttonId="page-modal"
          onClose={() => clickNextModal('confirm-modal')}
        >
          <h3>
            Now we'll set up your first page. For now, we'll make this
            your main landing page, but you can change that later from
            your admin dashboard.
          </h3>
          {firstPageInputs()}
          <button className={buttonClasses} id="page-next">
            Next
          </button>
        </Modal>

        <Modal
          closeId="confirm-next"
          className={styles.modal}
          buttonId="confirm-modal"
        >
          <h3>
            Before we submit all of this, go ahead and look over
            everything to make sure it looks okay.
          </h3>
          <button className={buttonClasses} id="confirm-next">
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
