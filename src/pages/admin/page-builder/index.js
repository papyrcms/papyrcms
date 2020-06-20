import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Router from 'next/router'
import userContext from '@/context/userContext'
import sectionOptionsContext from '@/context/sectionOptionsContext'
import keys from '@/keys'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import PostsForm from '@/components/PostsForm'
import Page from '../../[page]'
import styles from './page-builder.module.scss'


const PageBuilder = (props) => {

  const { sectionOptions } = useContext(sectionOptionsContext)

  const INITIAL_STATE = {
    id: '',
    title: '',
    url: '',
    className: '',
    navOrder: 0,
    sections: [],
    css: '',
    sectionSelect: 'Standard',
    validation: '',
    page: {
      className: '',
      url: '',
      sections: [],
      css: ''
    }
  }

  if (props.page) {
    INITIAL_STATE.id = props.page._id
    INITIAL_STATE.title = props.page.title
    INITIAL_STATE.url = props.page.route
    INITIAL_STATE.navOrder = props.page.navOrder
    INITIAL_STATE.className = props.page.className
    INITIAL_STATE.css = props.page.css
    INITIAL_STATE.sections = _.map(props.page.sections, section => {
      const parsedSection = JSON.parse(section)
      parsedSection.tags = _.join(parsedSection.tags, ', ')
      return parsedSection
    })
    INITIAL_STATE.page = props.page
  }

  const [state, setState] = useState(INITIAL_STATE)


  const removeSection = (index) => {
    const newSections = _.filter(state.sections, (section, i) => i !== index)
    const newPageSections = _.map(newSections, section => JSON.stringify(section))
    setState({ ...state, sections: newSections, page: { ...state.page, sections: newPageSections } })
  }


  const changeSectionState = (index, key, value) => {
    const newSections = _.map(state.sections, (section, i) => {
      if (index === i) {
        return { ...section, [key]: value }
      }
      return section
    })

    const newPageSections = _.map(state.page.sections, (jsonSection, i) => {
      const section = JSON.parse(jsonSection)

      if (index === i) {
        section[key] = value
      }

      if (typeof section.tags === 'string') {
        section.tags = _.map(_.split(section.tags, ','), tag => tag.trim())
      }

      return JSON.stringify(section)
    })

    setState({ ...state, sections: newSections, page: { ...state.page, sections: newPageSections } })
  }


  const renderTitleInput = (i, section) => {

    const { type, title } = section

    if (sectionOptions[type].inputs.includes('title')) {

      return <Input
        id={`${type}-${i}--title-${i}`}
        label="Section Title"
        name={`title-${i}`}
        value={title}
        onChange={(event) => changeSectionState(i, 'title', event.target.value)}
      />
    }
  }


  const renderClassNameInput = (i, section) => {

    const { type, className } = section

    if (sectionOptions[type].inputs.includes('className')) {

      return <Input
        id={`${type}-${i}--class-name-${i}`}
        label="Section Wrapper Class"
        name={`class-name-${i}`}
        value={className}
        onChange={(event) => changeSectionState(i, 'className', event.target.value)}
      />
    }
  }


  const renderTagsInput = (i, section) => {

    const { type, tags } = section

    if (sectionOptions[type].inputs.includes('tags')) {

      return <Input
        id={`${type}-${i}--tags-${i}`}
        label="Required Post Tags"
        name={`tags-${i}`}
        value={tags}
        onChange={(event) => changeSectionState(i, 'tags', event.target.value)}
      />
    }
  }


  const renderMaxPostsInput = (i, section) => {

    const { type, maxPosts } = section

    if (sectionOptions[type].inputs.includes('maxPosts')) {

      return <Input
        id={`${type}-${i}--max-posts-${i}`}
        type="number"
        label="Maximum number of posts in this section"
        name={`max-posts-${i}`}
        value={maxPosts}
        onChange={(event) => changeSectionState(i, 'maxPosts', event.target.value)}
      />
    }
  }


  const moveSection = (oldIndex, newIndex) => {

    const { sections } = state

    if (
      (oldIndex < newIndex && newIndex === sections.length) ||
      (oldIndex > newIndex && newIndex < 0)
    ) {
      return
    }

    let newSections = [...sections]
    newSections.splice(newIndex, 0, newSections.splice(oldIndex, 1)[0])
    const newPageSections = _.map(newSections, section => JSON.stringify(section))

    setState({ ...state, sections: [...newSections], page: { ...state.page, sections: newPageSections } })
  }


  const renderSections = () => {

    const { sections } = state

    return _.map(sections, (section, i) => {

      if (section) {

        const { type } = section
        const { name, description } = sectionOptions[type]

        return (
          <div key={`${type}-${i}`}>
            <hr />
            <div className={`${type} ${styles["page-builder__section"]}`}>
              <h3 className={`heading-tertiary ${type}__title`}>{name}</h3>
              <p className={`${type}__description ${styles["page-builder__section--description"]}`}>{description}</p>
              <div className={`${type}__inputs ${styles['page-builder__section--inputs']}`}>

                {renderTitleInput(i, section)}
                {renderClassNameInput(i, section)}
                {renderTagsInput(i, section)}
                {renderMaxPostsInput(i, section)}

              </div>

              <div className={`${type}__buttons ${styles["page-builder__section--buttons"]}`}>
                <div className={`${type}__move ${styles["page-builder__section--move"]}`}>
                  <button onClick={() => moveSection(i, i-1)} title="Move up" className="button button-primary">&uarr;</button>
                  <button onClick={() => moveSection(i, i+1)} title="Move down" className="button button-primary">&darr;</button>
                </div>
                <button
                  className="button button-delete"
                  onClick={() => removeSection(i)}
                >
                  Remove Section
                </button>
              </div>
            </div>
          </div>
        )
      }
    })
  }


  const renderSelectOptions = () => {
    return _.map(sectionOptions, (option, key) => {
      return <option
        key={key}
        value={key}
      >
        {option.name}
      </option>
    })
  }


  const addSection = () => {

    const { sections, sectionSelect } = state
    const section = sectionOptions[sectionSelect]

    const newSection = {
      type: sectionSelect,
      tags: '',
      title: '',
      maxPosts: section.maxPosts || 1,
      className: ''
    }

    const newPageSections = _.map(state.page.sections, section => section)
    newPageSections.push(JSON.stringify(newSection));

    setState({ ...state, sections: [...sections, newSection], page: { ...state.page, sections: newPageSections } })
  }


  const handleSubmit = () => {

    const { title, url, className, navOrder, sections, id, css } = state
    const postObject = {
      title,
      route: url,
      className,
      navOrder,
      sections,
      css
    }

    if (id) {

      axios.put(`/api/pages/${id}`, postObject).then(response => {
        Router.push('/admin/pages')
      }).catch(err => {
        setState({ ...state, validation: err.response.data.message })
      })

    } else {

      axios.post("/api/pages", postObject).then(response => {
        Router.push('/admin/pages')
      }).catch(err => {
        setState({ ...state, validation: err.response.data.message })
      })
    }
  }


  const deletePage = () => {

    const confirm = window.confirm('Are you sure you want to delete this page?')

    if (confirm) {
      const { id } = state
      axios.delete(`/api/pages/${id}`).then(response => {
        Router.push('/admin/pages')
      })
    }
  }


  const renderDelete = () => {

    const { id } = state
    if (id) {
      return <button
        className={`button button-delete ${styles["page-builder__section-bottom--delete"]}`}
        onClick={() => deletePage()}
      >
        Delete Page
      </button>
    }
  }


  const setPageState = (key, value) => {
    setState({ ...state, [key]: value, page: { ...state.page, [key]: value }})
  }


  const { title, url, className, navOrder, validation, page, css } = state
  const { currentUser } = useContext(userContext)

  if (!currentUser || !currentUser.isAdmin) return null

  return (
    <>
      <div className={styles["page-builder"]}>
        <h2 className="heading-secondary">Page Builder</h2>

        <div className={styles["page-builder__info"]}>
          <Input
            id="title-input"
            label="Page Title"
            placeholder="About"
            name="title"
            value={title}
            onChange={(event) => setPageState('title', event.target.value)}
          />

          <Input
            id="url-input"
            label="Page route"
            placeholder="about"
            name="url"
            value={url}
            onChange={(event) => setPageState('url', event.target.value)}
          />

          <Input
            id="nav-order-input"
            label="Nav menu order (0 to exclude)"
            name="nav-order"
            value={navOrder}
            type="number"
            onChange={(event) => setPageState('navOrder', event.target.value)}
          />

          <Input
            id="class-name-input"
            label="Page Wrapper Class Name"
            placeholder="about-page"
            name="wrapper-class"
            value={className}
            onChange={(event) => setPageState('className', event.target.value)}
          />
        </div>

        {renderSections()}

        <hr /><br />

        <div className={styles["page-builder__section-select"]}>

          <select
            className={`button button-secondary ${styles["page-builder__section-select--select"]}`}
            onChange={(event) => setState({ ...state, sectionSelect: (event.target.value) })}
          >
            {renderSelectOptions()}
          </select>

          <button
            className={`button button-primary ${styles["page-builder__section-select--submit"]}`}
            onClick={() => addSection()}
          >
            Add Section
          </button>

        </div>

        <div className={styles["page-builder__css"]}>
          <label
            className={styles["page-builder__css--label"]}
            htmlFor="page-builder__css"
          >
            Custom CSS
          </label>
          <textarea
            id="page-builder__css"
            className={styles["page-builder__css--textarea"]}
            onChange={event => setPageState('css', event.target.value)}
            value={css}
          />
        </div>

        <div className={styles["page-builder__section-bottom"]}>
          <button
            className="button button-primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>

          {renderDelete()}
        </div>
        <p className={styles["page-builder__validation"]}>{validation}</p>

        <div className={styles['page-builder__content-modal']}>
          <Modal
            buttonText="Add Content"
            buttonClasses='button button-primary'
            closeId="posts-form-submit"
          >
            <PostsForm
              pageTitle="New Content"
              onSubmit={() => null}
              className={styles['page-builder__posts-form']}
            />
          </Modal>
        </div>

      </div>

      <h3 className={`heading-tertiary ${styles["page-builder__preview--title"]}`}>Page Preview</h3>
      <div className={styles["page-builder__preview"]}>
        <Page previewPage={page} />
      </div>
    </>
  )
}


PageBuilder.getInitialProps = async ({ query }) => {
  
  let page
  if (query.page) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/pages/${query.page}`)
    page = res.data
  }

  return { page }
}


export default PageBuilder
