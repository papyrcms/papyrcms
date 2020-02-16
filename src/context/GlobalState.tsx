import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'


const GlobalState = props => (
  <UserProvider>
    <StoreProvider>
      <PostsProvider posts={props.posts}>
        {props.children}
      </PostsProvider>
    </StoreProvider>
  </UserProvider>
)


export default GlobalState
