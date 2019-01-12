import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import keys from '../config/keys';
import PostsFilter from '../components/PostsFilter';
import SectionStandard from '../components/SectionStandard';

class AboutPage extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : '';
    const posts = await axios.get(`${rootUrl}/api/published_posts`);

    return { posts: posts.data };
  }


  render() {

    return (
      <PostsFilter
        component={ SectionStandard }
        posts={ this.props.posts }
        maxPosts={ 1 }
        postTags={ ['about'] }
        componentProps={{ title: 'About', className: 'about-page' }}
      />
    );
  }
}


const mapStateToProps = state => {
  return { posts: state.posts };
};


export default connect( mapStateToProps )( AboutPage );
