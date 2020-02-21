import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import PagesProvider from './PagesProvider'


const GlobalState = props => (
  <UserProvider>
    <PagesProvider pages={props.pages}>
      <PostsProvider posts={props.posts}>
        <StoreProvider>
          {props.children}
        </StoreProvider>
      </PostsProvider>
    </PagesProvider>
  </UserProvider>
)


export default GlobalState
