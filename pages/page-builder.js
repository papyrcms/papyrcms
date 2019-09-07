import React, { Component } from 'react'
import Input from '../components/Input'

class PageBuilder extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sectionSelectOptions: {
        'postDisplay': { title: 'Post Display', postLimit: 1 }
      },
      sectionSelect: 'postDisplay',
      sections: []
    }
  }


  renderTagsFields(section, sectionIndex) {

    const { sectionSelectOptions, sections } = this.state

    for (let i = 0; i < sectionSelectOptions[section.sectionKey].postLimit; i++) {

      return <Input
        id={`${section.sectionKey}-${i}`}
        label="Required Tags (comma-separated)"
        name={`${section.sectionKey}-${i}`}
        value={sections.sectionKey}
        onChange={event => {
          const newSection = {
            sectionKey: section.sectionKey,
            [`tags-${i}`]: event.target.value
          }

          const newSectionState = sections.map((sectionState, index) => {
            if (index === sectionIndex) {
              return newSection
            }

            return sectionState
          })

          this.setState({ sections: [...sections, newSectionState]})
        }}
      />
    }
  }


  renderSections() {

    const { sections, sectionSelectOptions } = this.state

    return sections.map((section, sectionIndex) => {

      return (
        <div className="page-builder__section">
          <h3 className="heading-tertiary">{sectionSelectOptions[section.sectionKey].title}</h3>

          {this.renderTagsFields(section, sectionIndex)}
        </div>
      )
    })
  }


  renderSelectOptions() {

    const { sectionSelectOptions } = this.state

    return Object.keys(sectionSelectOptions).map(key => {
      return <option value={key}>{sectionSelectOptions[key].title}</option>
    })
  }


  render() {
console.log(this.state)
    const { sectionSelect, sections, sectionSelectOptions } = this.state

    return (
      <div className="page-builder">

        <div className="page-builder__section-select">
          <select
            className="button button-secondary page-builder__section-select--select"
            onChange={event => this.setState({ sectionSelect: event.target.value })}
          >
            {this.renderSelectOptions()}
          </select>
          <button
            className="button button-primary page-builder__section-select--submit"
            onClick={() => {
              const newSection = { sectionKey: sectionSelect }
              for (let i = 0; i < sectionSelectOptions[sectionSelect].postLimit; i++) {
                newSection[`tags-${i}`] = ''
              }

              this.setState({ sections: [...sections, newSection] })
            }}
          >
            Add Section
          </button>
        </div>

        {this.renderSections()}

      </div>
    )
  }
}

export default PageBuilder