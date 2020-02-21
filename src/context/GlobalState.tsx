import SettingsProvider from './SettingsProvider'
import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import PagesProvider from './PagesProvider'


const GlobalState = props => (
  <SettingsProvider settings={props.settings}>
    <UserProvider>
      <PagesProvider pages={props.pages}>
        <PostsProvider posts={props.posts}>
          <StoreProvider>
            {props.children}
          </StoreProvider>
        </PostsProvider>
      </PagesProvider>
    </UserProvider>
  </SettingsProvider>
)


export default GlobalState
