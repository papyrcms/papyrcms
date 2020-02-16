import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import PagesProvider from './PagesProvider'


const GlobalState = props => (
  <UserProvider>
    <StoreProvider>
      <PagesProvider pages={props.pages}>
        <PostsProvider posts={props.posts}>
          {props.children}
        </PostsProvider>
      </PagesProvider>
    </StoreProvider>
  </UserProvider>
)


export default GlobalState
