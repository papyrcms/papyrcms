import { Page } from 'types'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Router from 'next/router'
import Error from 'next/error'
import { userContext, sectionOptionsContext } from '@/context'
import keys from '@/keys'
import { Input, Button, Modal, PostsForm } from '@/components'
import PageRenderer from '../../[page]'
import styles from './page-builder.module.scss'

type Props = {
  page: Page
}

const PageBuilder = (props: Props) => {
  const { sectionOptions } = useContext(sectionOptionsContext)

  type InitialState = {
    id: string
    title: string
    route: string
    className: string
    navOrder: number
    omitDefaultHeader: boolean
    omitDefaultFooter: boolean
    sections: any[]
    css: string
    sectionSelect: 'Standard'
    validation: string
    page: Page
  }

  const INITIAL_STATE: InitialState = {
    id: '',
    title: '',
    route: '',
    className: '',
    navOrder: 0,
    omitDefaultHeader: false,
    omitDefaultFooter: false,
    sections: [],
    css: '',
    sectionSelect: 'Standard',
    validation: '',
    page: {
      className: '',
      route: '',
      sections: [] as string[],
      css: '',

      // For type safety
      omitDefaultFooter: false,
      omitDefaultHeader: false,
      _id: 'fake_id',
      created: new Date().toISOString(),
      title: 'Page Preview',
      navOrder: 0,
    },
  }

  if (props.page) {
    INITIAL_STATE.id = props.page._id
    INITIAL_STATE.title = props.page.title
    INITIAL_STATE.route = props.page.route
    INITIAL_STATE.navOrder = props.page.navOrder
    INITIAL_STATE.className = props.page.className
    INITIAL_STATE.omitDefaultHeader = !!props.page.omitDefaultHeader
    INITIAL_STATE.omitDefaultFooter = !!props.page.omitDefaultFooter
    INITIAL_STATE.css = props.page.css
    INITIAL_STATE.sections = _.map(props.page.sections, (section) => {
      const parsedSection = JSON.parse(section)
      parsedSection.tags = _.join(parsedSection.tags, ', ')
      return parsedSection
    })
    INITIAL_STATE.page = props.page
  }

  const [state, setState] = useState(INITIAL_STATE)

  const removeSection = (index: number) => {
    const newSections = _.filter(
      state.sections,
      (section, i) => i !== index
    )
    const newPageSections = _.map(newSections, (section) =>
      JSON.stringify(section)
    )
    setState({
      ...state,
      sections: newSections,
      page: { ...state.page, sections: newPageSections },
    })
  }

  const changeSectionState = (
    index: number,
    key: string,
    value: string
  ) => {
    const newSections = _.map(state.sections, (section, i) => {
      if (index === i) {
        return { ...section, [key]: value }
      }
      return section
    })

    const newPageSections = _.map(
      state.page.sections,
      (jsonSection, i) => {
        const section = JSON.parse(jsonSection)

        if (index === i) {
          section[key] = value
        }

        if (typeof section.tags === 'string') {
          // section.tags = _.map(_.split(section.tags, ','), (tag) =>
          //   tag.trim()
          // )
        }

        return JSON.stringify(section)
      }
    )

    setState({
      ...state,
      sections: newSections,
      page: { ...state.page, sections: newPageSections },
    })
  }

  const renderTitleInput = (
    i: number,
    section: { type: string; title: string }
  ) => {
    const { type, title } = section

    if (sectionOptions[type].inputs.includes('title')) {
      return (
        <Input
          id={`${type}-${i}--title-${i}`}
          label="Section Title"
          name={`title-${i}`}
          value={title}
          onChange={(event: any) =>
            changeSectionState(i, 'title', event.target.value)
          }
        />
      )
    }
  }

  const renderClassNameInput = (
    i: number,
    section: { type: string; className: string }
  ) => {
    const { type, className } = section

    if (sectionOptions[type].inputs.includes('className')) {
      return (
        <Input
          id={`${type}-${i}--class-name-${i}`}
          label="Section Wrapper Class"
          name={`class-name-${i}`}
          value={className}
          onChange={(event: any) =>
            changeSectionState(i, 'className', event.target.value)
          }
        />
      )
    }
  }

  const renderTagsInput = (
    i: number,
    section: { type: string; tags: string }
  ) => {
    const { type, tags } = section

    if (sectionOptions[type].inputs.includes('tags')) {
      return (
        <Input
          id={`${type}-${i}--tags-${i}`}
          label="Required Post Tags"
          name={`tags-${i}`}
          // value={_.join(tags, ', ')}
          value={tags}
          onChange={(event: any) =>
            changeSectionState(i, 'tags', event.target.value)
          }
        />
      )
    }
  }

  const renderMaxPostsInput = (
    i: number,
    section: { type: string; maxPosts: number }
  ) => {
    const { type, maxPosts } = section

    if (sectionOptions[type].inputs.includes('maxPosts')) {
      return (
        <Input
          id={`${type}-${i}--max-posts-${i}`}
          type="number"
          label="Maximum number of posts in this section"
          name={`max-posts-${i}`}
          value={maxPosts}
          onChange={(event: any) =>
            changeSectionState(i, 'maxPosts', event.target.value)
          }
        />
      )
    }
  }

  const moveSection = (oldIndex: number, newIndex: number) => {
    const { sections } = state

    if (
      (oldIndex < newIndex && newIndex === sections.length) ||
      (oldIndex > newIndex && newIndex < 0)
    ) {
      return
    }

    let newSections = [...sections]
    newSections.splice(
      newIndex,
      0,
      newSections.splice(oldIndex, 1)[0]
    )
    const newPageSections = _.map(newSections, (section) =>
      JSON.stringify(section)
    )

    setState({
      ...state,
      sections: [...newSections],
      page: { ...state.page, sections: newPageSections },
    })
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
            <div className={styles.section}>
              <h3 className="heading-tertiary">{name}</h3>
              <p className={styles.sectionDescription}>
                {description}
              </p>
              <div className={styles.sectionInputs}>
                {renderTitleInput(i, section)}
                {renderClassNameInput(i, section)}
                {renderTagsInput(i, section)}
                {renderMaxPostsInput(i, section)}
              </div>

              <div className={styles.sectionButtons}>
                <div className={styles.sectionMove}>
                  <button
                    onClick={() => moveSection(i, i - 1)}
                    title="Move up"
                    className="button button-primary"
                  >
                    &uarr;
                  </button>
                  <button
                    onClick={() => moveSection(i, i + 1)}
                    title="Move down"
                    className="button button-primary"
                  >
                    &darr;
                  </button>
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
      return (
        <option key={key} value={key}>
          {option.name}
        </option>
      )
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
      className: '',
    }

    const newPageSections = _.map(
      state.page.sections,
      (section) => section
    )
    newPageSections.push(JSON.stringify(newSection))

    setState({
      ...state,
      sections: [...sections, newSection],
      page: { ...state.page, sections: newPageSections },
    })
  }

  const handleSubmit = (event: any, resetButton: Function) => {
    const {
      title,
      route,
      className,
      navOrder,
      omitDefaultHeader,
      omitDefaultFooter,
      sections,
      id,
      css,
    } = state
    const postObject = {
      title,
      route: route,
      className,
      navOrder,
      omitDefaultFooter,
      omitDefaultHeader,
      sections,
      css,
    }

    if (id) {
      axios
        .put(`/api/pages/${id}`, postObject)
        .then((response) => {
          resetButton()
          Router.push('/admin/pages')
        })
        .catch((err) => {
          resetButton()
          setState({
            ...state,
            validation: err.response.data.message,
          })
        })
    } else {
      axios
        .post('/api/pages', postObject)
        .then((response) => {
          resetButton()
          Router.push('/admin/pages')
        })
        .catch((err) => {
          resetButton()
          setState({
            ...state,
            validation: err.response.data.message,
          })
        })
    }
  }

  const deletePage = (event: any, resetButton: Function) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this page?'
    )

    if (confirm) {
      const { id } = state
      axios
        .delete(`/api/pages/${id}`)
        .then((response) => {
          resetButton()
          Router.push('/admin/pages')
        })
        .catch((err) => resetButton())
    }
  }

  const renderDelete = () => {
    const { id } = state
    if (id) {
      return (
        <Button
          type="delete"
          onClick={deletePage}
          submittedText="Deleting..."
        >
          Delete Page
        </Button>
      )
    }
  }

  const setPageState = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
      page: { ...state.page, [key]: value },
    })
  }

  const {
    title,
    route,
    className,
    navOrder,
    omitDefaultFooter,
    omitDefaultHeader,
    validation,
    page,
    css,
  } = state
  const { currentUser } = useContext(userContext)

  if (!currentUser?.isAdmin) return <Error statusCode={403} />

  return (
    <>
      <div className={styles.builder}>
        <h2 className="heading-secondary">Page Builder</h2>

        <div className={styles.info}>
          <Input
            id="title-input"
            label="Page Title"
            placeholder="About"
            name="title"
            value={title}
            onChange={(event: any) =>
              setPageState('title', event.target.value)
            }
          />

          <Input
            id="route-input"
            label="Page route"
            placeholder="about"
            name="route"
            value={route}
            onChange={(event: any) =>
              setPageState('route', event.target.value)
            }
          />

          <Input
            id="nav-order-input"
            label="Nav menu order (0 to exclude)"
            name="nav-order"
            value={navOrder}
            type="number"
            onChange={(event: any) =>
              setPageState('navOrder', event.target.value)
            }
          />

          <Input
            id="class-name-input"
            label="Page Wrapper Class Name"
            placeholder="about-page"
            name="wrapper-class"
            value={className}
            onChange={(event: any) =>
              setPageState('className', event.target.value)
            }
          />

          <Input
            id="omit-default-header-input"
            label="Omit Default Header"
            type="checkbox"
            value={omitDefaultHeader}
            onChange={(event: any) =>
              setPageState('omitDefaultHeader', event.target.checked)
            }
          />

          <Input
            id="omit-default-footer-input"
            label="Omit Default Footer"
            type="checkbox"
            value={omitDefaultFooter}
            onChange={(event: any) =>
              setPageState('omitDefaultFooter', event.target.checked)
            }
          />
        </div>

        {renderSections()}

        <hr />
        <br />

        <div className={styles.sectionSelect}>
          <select
            className={`button button-secondary ${styles.sectionSelector}`}
            onChange={(event: any) =>
              setState({
                ...state,
                sectionSelect: event.target.value,
              })
            }
            value={state.sectionSelect}
          >
            {renderSelectOptions()}
          </select>

          <button
            className={`button button-primary ${styles['page-builder__section-select--submit']}`}
            onClick={() => addSection()}
          >
            Add Section
          </button>
        </div>

        <div className={styles.css}>
          <label
            className={styles.cssLabel}
            htmlFor="page-builder__css"
          >
            Custom CSS
          </label>
          <textarea
            id="page-builder__css"
            className={styles.cssTextarea}
            onChange={(event) =>
              setPageState('css', event.target.value)
            }
            value={css || ''}
          />
        </div>

        <div className={styles.sectionBottom}>
          <Button onClick={handleSubmit} submittedText="Saving...">
            Submit
          </Button>

          {renderDelete()}
        </div>
        <p className={styles.validation}>{validation}</p>

        <div className={styles.contentModal}>
          <Modal
            buttonText="Add Content"
            buttonClasses="button button-primary"
            closeId="posts-form-submit"
          >
            <PostsForm
              pageTitle="New Content"
              onSubmit={() => null}
              className={styles.postForm}
            />
          </Modal>
        </div>
      </div>

      <h3 className={`heading-tertiary ${styles.previewTitle}`}>
        Page Preview
      </h3>
      <div>
        <PageRenderer previewPage={page} />
      </div>
    </>
  )
}

PageBuilder.getInitialProps = async ({
  query,
}: {
  query: { page: string }
}) => {
  let page
  if (query.page) {
    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.get(`${rootUrl}/api/pages/${query.page}`)
    page = res.data
  }

  return { page }
}

export default PageBuilder
