import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PostsFilter from '../components/PostsFilter';
import SectionCards from '../components/SectionCards';
import SectionVideo from '../components/SectionVideo';

class Landing extends Component {

  static async getInitialProps( context ) {

    let posts = [];

    if ( !!context.res ) {
      posts = context.query.posts;
    } else {
      const response = await axios.get(`/api/published_posts`);
      posts = response.data
    }

    return { posts };
  }


  render() {

    const { sectionCardSettings, sectionVideoSettings } = this.props.settings;

    const sectionCardsProps = {
      title: 'This is the Section Card component',
      contentLength: 200,
      readMore: true
    };

    return (
      <div className="landing">
        <PostsFilter
          component={ SectionCards }
          posts={ this.props.posts }
          settings={ sectionCardSettings }
          componentProps={ sectionCardsProps }
        />
        <PostsFilter 
          component={ SectionVideo }
          posts={ this.props.posts }
          settings={ sectionVideoSettings }
        />
      </div>
    );
  }
}


const mapStateToProps = state => {
  return { posts: state.posts, settings: state.settings };
};


export default connect( mapStateToProps )( Landing );
