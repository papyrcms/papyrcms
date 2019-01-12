import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import keys from '../config/keys';
import PostsFilter from '../components/PostsFilter';
import SectionCards from '../components/SectionCards';
import SectionVideo from '../components/SectionVideo';

class Landing extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : '';
    const posts = await axios.get(`${rootUrl}/api/published_posts`);

    return { posts: posts.data };
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
