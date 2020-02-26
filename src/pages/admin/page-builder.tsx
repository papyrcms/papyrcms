import React, { Fragment, useState, useContext } from 'react'
import axios from 'axios'
import Router from 'next/router'
import userContext from '../../context/userContext'
import keys from '../../config/keys'
import Input from '../../components/Input'
import Page from '../[page]'


// Static object of sections for the builder
const sectionOptions = {
  Standard: {
    name: 'Standard Section',
    description: 'This is the simplest component. It will only take one post with the required tags.',
    inputs: ['className', 'tags'],
    maxPosts: 1
  },
  Strip: {
    name: 'Strip Section',
    description: 'This section will display each post in a horizontal style with the media alternating rendering on the left and right sides per post.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  LeftStrip: {
    name: 'Left Strip Section',
    description: 'This section will display each post in a horizontal style with the media rendering on the left side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  RightStrip: {
    name: 'Right Strip Section',
    description: 'This section will display each post in a horizontal style with the media rendering on the right side of the posts.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  ThreeCards: {
    name: 'Three Cards Section',
    description: 'This section will display each post in a vertical style with three posts per row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  FourCards: {
    name: 'Four Cards Section',
    description: 'This section will display each post in a vertical style with four posts per row.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  Slideshow: {
    name: 'Slideshow Section',
    description: 'This section will display a slideshow of each post at 5 second intervals.',
    inputs: ['className', 'maxPosts', 'tags', 'title'],
  },
  Parallax: {
    name: 'Parallax Section',
    description: 'This section will display a post with the parallax effect on the media.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
  },
  Media: {
    name: 'Media Section',
    description: 'This section will display a post media normally.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 1,
  },
  Map: {
    name: 'Map Section',
    description: 'This section will display a google map at the location specified by the latitude and longitude posts, along with the content of the main post.',
    inputs: ['className', 'tags', 'title'],
    maxPosts: 3
  },
  ContactForm: {
    name: 'Contact Form',
    description: 'This is a simple contact form where people can leave their name, email, and a message for you. It is not content-based.',
    inputs: ['className']
  },
  DonateForm: {
    name: 'Donate Form',
    description: 'This is a simple donation form where people can donate money to you.',
    inputs: ['className']
  }
}


const PageBuilder = props => {

  const INITIAL_STATE = {
    id: '',
    title: '',
    url: '',
    className: '',
    navOrder: 0,
    sections: [],
    css: '',
    sectionSelect: 'Strip',
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
    INITIAL_STATE.sections = props.page.sections.map(section => {
      const parsedSection = JSON.parse(section)
      parsedSection.tags = parsedSection.tags.join(', ')
      return parsedSection
    })
    INITIAL_STATE.page = props.page
  }

  const [state, setState] = useState(INITIAL_STATE)


  const removeSection = index => {
    const newSections = state.sections.filter((section, i) => i !== index)
    const newPageSections = newSections.map(section => JSON.stringify(section))
    setState({ ...state, sections: newSections, page: { ...state.page, sections: newPageSections } })
  }


  const changeSectionState = (index, key, value) => {
    const newSections = state.sections.map((section, i) => {
      if (index === i) {
        section[key] = value
      }
      return section
    })

    // state.page.sections = newSections.map(section => JSON.stringify(section))
    const newPageSections = state.page.sections.map((section, i) => {
      section = JSON.parse(section)

      if (index === i) {
        section[key] = value
      }

      if (typeof section.tags === 'string') {
        section.tags = section.tags.split(',').map(tag => tag.trim())
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
        label="Component Title"
        name={`title-${i}`}
        value={title}
        onChange={event => changeSectionState(i, 'title', event.target.value)}
      />
    }
  }


  const renderClassNameInput = (i, section) => {

    const { type, className } = section

    if (sectionOptions[type].inputs.includes('className')) {

      return <Input
        id={`${type}-${i}--class-name-${i}`}
        label="Component Wrapper Class"
        name={`class-name-${i}`}
        value={className}
        onChange={event => changeSectionState(i, 'className', event.target.value)}
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
        onChange={event => changeSectionState(i, 'tags', event.target.value)}
      />
    }
  }


  const renderMaxPostsInput = (i, section) => {

    const { type, maxPosts } = section

    if (sectionOptions[type].inputs.includes('maxPosts')) {

      return <Input
        id={`${type}-${i}--max-posts-${i}`}
        type="number"
        label="Maximum number of posts in this component"
        name={`max-posts-${i}`}
        value={maxPosts}
        onChange={event => changeSectionState(i, 'maxPosts', event.target.value)}
      />
    }
  }


  const renderSections = () => {

    const { sections } = state as any

    return sections.map((section, i) => {

      if (section) {

        const { type } = section
        const { name, description } = sectionOptions[type]

        return (
          <div key={`${type}-${i}`}>
            <div className={`${type} page-builder__section`}>
              <h3 className={`heading-tertiary ${type}__title`}>{name}</h3>
              <p className={`${type}__description page-builder__section--description`}>{description}</p>
              <div className={`${type}__inputs page-builder__section--inputs`}>

                {renderTitleInput(i, section)}
                {renderClassNameInput(i, section)}
                {renderTagsInput(i, section)}
                {renderMaxPostsInput(i, section)}

              </div>
              <button
                className="button button-delete"
                onClick={() => removeSection(i)}
              >
                Remove Section
              </button>
            </div>
          </div>
        )
      }
    })
  }


  const renderSelectOptions = () => {

    return Object.keys(sectionOptions).map(key => {

      return <option
        key={key}
        value={key}
      >
        {sectionOptions[key].name}
      </option>
    })
  }


  const addSection = () => {

    const { sections, sectionSelect } = state

    const newSection = {
      type: sectionSelect,
      tags: '',
      title: '',
      maxPosts: sectionOptions[sectionSelect].maxPosts || 1,
      className: ''
    }

    const newPageSections = state.page.sections.map(section => section)
    newPageSections.push(JSON.stringify(newSection));

    setState({ ...state, sections: [...sections, newSection], page: { ...state.page, sections: newPageSections } })
  }


  const handleSubmit = () => {

    const { title, url, className, navOrder, sections, id, css } = state as any
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
      const { id } = state as any
      axios.delete(`/api/pages/${id}`).then(response => {
        Router.push('/admin/pages')
      })
    }
  }


  const renderDelete = () => {

    const { id } = state as any
    if (id) {
      return <button
        className="button button-delete page-builder__section-bottom--delete"
        onClick={() => deletePage()}
      >
        Delete Page
      </button>
    }
  }


  const setPageState = (key, value) => {
    setState({ ...state, [key]: value, page: { ...state.page, [key]: value }})
  }


  const { title, url, className, navOrder, validation, page, css } = state as any
  const { currentUser } = useContext(userContext)

  if (!currentUser || !currentUser.isAdmin) {
    return <div />
  }

  return (
    <Fragment>
      <div className="page-builder">
        <h2 className="heading-secondary">Page Builder</h2>

        <div className="page-builder__info">
          <Input
            id="title-input"
            label="Page Title"
            placeholder="About"
            name="title"
            value={title}
            onChange={event => setPageState('title', event.target.value)}
          />

          <Input
            id="url-input"
            label="Page route"
            placeholder="about"
            name="url"
            value={url}
            onChange={event => setPageState('url', event.target.value)}
          />

          <Input
            id="nav-order-input"
            label="Nav menu order (0 to exclude)"
            name="nav-order"
            value={navOrder}
            type="number"
            onChange={event => setPageState('navOrder', event.target.value)}
          />

          <Input
            id="class-name-input"
            label="Page Wrapper Class Name"
            placeholder="about-page"
            name="wrapper-class"
            value={className}
            onChange={event => setPageState('className', event.target.value)}
          />
        </div>

        {renderSections()}

        <div className="page-builder__section-select">

          <select
            className="button button-secondary page-builder__section-select--select"
            onChange={event => setState({ ...state, sectionSelect: event.target.value })}
          >
            {renderSelectOptions()}
          </select>

          <button
            className="button button-primary page-builder__section-select--submit"
            onClick={() => addSection()}
          >
            Add Section
          </button>

        </div>

        <div className="page-builder__css">
          <label
            className="page-builder__css--label"
            htmlFor="page-builder__css"
          >
            Custom CSS
          </label>
          <textarea
            id="page-builder__css"
            className="page-builder__css--textarea"
            onChange={event => setPageState('css', event.target.value)}
            value={css}
          />
        </div>

        <div className="page-builder__section-bottom">
          <button
            className="button button-primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>

          {renderDelete()}
        </div>
        <p className="page-builder__validation">{validation}</p>

      </div>

      <h3 className="heading-tertiary page-builder__preview--title">Page Preview</h3>
      <div className="page-builder__preview">
        <Page previewPage={page} />
      </div>
    </Fragment>
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
