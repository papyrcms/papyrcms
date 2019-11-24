import React, { Component } from 'react'
import axios from 'axios'
import Input from '../components/Input'


class PageBuilder extends Component {

  // Static object of sections for the builder
  sectionOptions = {
    PostShow: {
      name: 'Post Page',
      description: 'This is the simplest component. It will only take one post with the required tags.',
      inputs: ['className', 'tags'],
      maxPosts: 1
    },
    Standard: {
      name: 'Standard Section',
      description: 'This section will display each post in a horizontal style with the media alternating rendering on the left and right sides per post.',
      inputs: ['className', 'maxPosts', 'tags', 'title'],
    },
    LeftStandard: {
      name: 'Left Standard Section',
      description: 'This section will display each post in a horizontal style with the media rendering on the left side of the posts.',
      inputs: ['className', 'maxPosts', 'tags', 'title'],
    },
    RightStandard: {
      name: 'Right Standard Section',
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
    }
  }


  constructor(props) {

    super(props)

    this.state = {
      url: '',
      className: '',
      sectionSelect: 'PostShow',
      sections: []
    }
  }


  removeSection(index) {

    this.setState(prevState => {

      const newSections = prevState.sections.filter((_, i) => i !== index)

      return { sections: newSections }
    })
  }


  changeSectionState(index, key, value) {

    this.setState(prevState => {

      const newSections = prevState.sections.map((section, i) => {
        if (index === i) {
          section[key] = value
        }
        return section
      })
      return { sections: newSections }
    })
  }


  renderTitleInput(i, section) {

    const { type, title } = section

    if (this.sectionOptions[type].inputs.includes('title')) {

      return <Input
        id={`${type}-${i}--title-${i}`}
        label="Component Title"
        name={`title-${i}`}
        value={title}
        onChange={event => this.changeSectionState(i, 'title', event.target.value)}
      />
    }
  }


  renderClassNameInput(i, section) {

    const { type, className } = section

    if (this.sectionOptions[type].inputs.includes('className')) {

      return <Input
        id={`${type}-${i}--class-name-${i}`}
        label="Component Wrapper Class"
        name={`class-name-${i}`}
        value={className}
        onChange={event => this.changeSectionState(i, 'className', event.target.value)}
      />
    }
  }


  renderTagsInput(i, section) {

    const { type, tags } = section

    if (this.sectionOptions[type].inputs.includes('tags')) {

      return <Input
        id={`${type}-${i}--tags-${i}`}
        label="Required Post Tags"
        name={`tags-${i}`}
        value={tags}
        onChange={event => this.changeSectionState(i, 'tags', event.target.value)}
      />
    }
  }


  renderMaxPostsInput(i, section) {

    const { type, maxPosts } = section

    if (this.sectionOptions[type].inputs.includes('maxPosts')) {

      return <Input
        id={`${type}-${i}--max-posts-${i}`}
        type="number"
        label="Maximum number of posts in this component"
        name={`max-posts-${i}`}
        value={maxPosts}
        onChange={event => this.changeSectionState(i, 'maxPosts', event.target.value)}
      />
    }
  }


  renderSections() {

    return this.state.sections.map((section, i) => {

      if (section) {

        const { type } = section
        const { name, description } = this.sectionOptions[type]

        return (
          <div key={`${type}-${i}`}>
            <div className={`${type} page-builder__section`}>
              <h3 className={`heading-tertiary ${type}__title`}>{name}</h3>
              <p className={`${type}__description`}>{description}</p>
              <div className={`${type}__inputs`}>

                {this.renderTitleInput(i, section)}
                {this.renderClassNameInput(i, section)}
                {this.renderTagsInput(i, section)}
                {this.renderMaxPostsInput(i, section)}

              </div>
              <button
                className="button button-delete"
                onClick={() => this.removeSection(i)}
              >
                Remove Section
              </button>
            </div>
          </div>
        )
      }
    })
  }


  renderSelectOptions() {

    return Object.keys(this.sectionOptions).map(key => {

      return <option
        key={key}
        value={key}
      >
        {this.sectionOptions[key].name}
      </option>
    })
  }


  addSection() {

    this.setState(prevState => {
      const { sections, sectionSelect } = prevState

      const newSection = {
        type: sectionSelect,
        tags: '',
        title: '',
        maxPosts: this.sectionOptions[sectionSelect].maxPosts || 0,
        className: ''
      }

      return { sections: [...sections, newSection] }
    })
  }


  handleSubmit() {

    const { url, className, sections } = this.state

    axios.post("/api/page", {
      route: url,
      className,
      sections
    }).then(response => {
      console.log(response.data)
    })
  }


  render() {

    return (
      <div className="page-builder">
        <h2 className="heading-secondary">Page Builder</h2>

        <Input
          id="url-input"
          label="Page route"
          placeholder="about"
          name="url"
          value={this.state.url}
          onChange={event => this.setState({ url: event.target.value })}
        />

        <Input
          id="class-name-input"
          label="Page Wrapper Class Name"
          placeholder="about-page"
          name="wrapper-class"
          value={this.state.className}
          onChange={event => this.setState({ className: event.target.value })}
        />

        {this.renderSections()}

        <div className="page-builder__section-select">

          <select
            className="button button-secondary page-builder__section-select--select"
            onChange={event => this.setState({ sectionSelect: event.target.value })}
          >
            {this.renderSelectOptions()}
          </select>

          <button
            className="button button-primary page-builder__section-select--submit"
            onClick={() => this.addSection()}
          >
            Add Section
          </button>

        </div>

        <button
          className="button button-primary"
          onClick={() => this.handleSubmit()}
        >
          Submit
        </button>
      </div>
    )
  }
}

export default PageBuilder
