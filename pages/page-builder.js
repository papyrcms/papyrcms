import React, { Component } from 'react'
import Input from '../components/Input'


const PostDisplaySection = props => {

  const {
    index,
    removeSection,
    changeState,
    requiredTags,
    wrapperClass
  } = props

  return (
    <div className="post-display page-builder__section">
      <h3 className="heading-tertiary post-display__title">Post Display</h3>
      <p className="post-display__description">This is the simplest component. It will only take one post with the required tags. You can additionally insert a wrapper class to wrap the section.</p>
      <div className="post-display__inputs">
        <Input
          id={`post-display-${index}--required-tags-${index}`}
          label="Required Post Tags"
          name="required-tags"
          value={requiredTags}
          onChange={event => changeState({ requiredTags: event.target.value })}
        />
        <Input
          id={`post-display-${index}--wrapper-class-${index}`}
          label="Component Wrapper Class"
          name="wrapper-class"
          value={wrapperClass}
          onChange={event => changeState({ wrapperClass: event.target.value })}
        />
      </div>
      <button
        className="button button-delete"
        onClick={() => removeSection()}
      >
        Remove Section
      </button>
    </div>
  )
}


class PageBuilder extends Component {

  constructor(props) {

    super(props)

    this.state = {
      sectionSelect: 'postDisplay',
      sections: [],
      url: '',
      sectionOptions: {
        'postDisplay': {
          title: 'Post Display',
          component: PostDisplaySection,
          initialState: {
            wrapperClass: '',
            requiredTags: ''
          }
        }
      },
    }
  }


  removeSection(index) {

    this.setState(prevState => {

      const newSections = prevState.sections.splice(index)

      return { sections: newSections }
    })
  }


  changeSectionState(index, newState) {

    this.setState(prevState => {

      const newSectionState = []

      prevState.sections.forEach((section, i) => {

        newSectionState[i] = {}

        for (const key in section) {
          newSectionState[i][key] = section[key]
        }

        if (index === i) {
          for (const key in newState) {
            newSectionState[i].state[key] = newState[key]
          }
        }
      })

      return { sections: newSectionState }
    })
  }


  renderSections() {

    return this.state.sections.map((section, i) => {

      if (section) {
        const { Component, title, state } = section

        return <Component
          key={`${title}-${i}`}
          index={i}
          removeSection={() => this.removeSection(i)}
          changeState={newState => this.changeSectionState(i, newState)}
          {...state}
        />
      }
    })
  }


  renderSelectOptions() {

    const { sectionOptions } = this.state

    return Object.keys(sectionOptions).map(key => {
      return <option key={key} value={key}>{sectionOptions[key].title}</option>
    })
  }


  addSection() {

    this.setState(prevState => {

      const { sectionOptions, sectionSelect, sections } = prevState

      const newSection = {
        title: sectionOptions[sectionSelect].title,
        Component: sectionOptions[sectionSelect].component,
        state: Object.assign({}, sectionOptions[sectionSelect].initialState)
      }

      return { sections: [...sections, newSection] }
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

          <button
            className="button button-primary"
            onClick={() => console.log(this.state)}
          >
            Submit
          </button>

        </div>
      </div>
    )
  }
}

export default PageBuilder
