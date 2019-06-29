import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import PostsForm from '../components/PostsForm'
import keys from '../config/keys'


// const TestField = props => (
//   <div className="post-form__field">
//     <label className="post-form__label">Test</label>
//     <input
//       className="post-form__input"
//       type="text"
//       name="test"
//       value={props.test}
//       onChange={event => props.changeState(event.target.value, 'test')}
//     />
//   </div>
// )


const BlogEdit = props => (
  <PostsForm
    pageTitle="Edit Blog Post"
    post={props.blog}
    apiEndpoint={`/api/blogs/${props.blog._id}`}
    redirectRoute="/blog/all"
    editing
  />
)


BlogEdit.getInitialProps = async ({ query, req }) => {

  let axiosConfig

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const blog = await axios.get(`${rootUrl}/api/blogs/${query.id}`, axiosConfig)

  return { blog: blog.data }
}


const mapStateToProps = state => {
  return { blog: state.blog }
}


export default connect(mapStateToProps)(BlogEdit)
